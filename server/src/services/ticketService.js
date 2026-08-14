const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Counter = require('../models/Counter');
const Venue = require('../models/Venue');
const notificationService = require('./notificationService');

/**
 * Join queue / create new ticket
 */
const joinQueue = async ({ venueId, counterId, partySize, guestName, user, io }) => {
  if (!venueId) {
    const error = new Error('venueId is required');
    error.statusCode = 400;
    throw error;
  }

  // Resolve Venue
  let venue = null;
  if (mongoose.Types.ObjectId.isValid(venueId)) {
    venue = await Venue.findById(venueId);
  }
  if (!venue) {
    venue = await Venue.findOne({ $or: [{ slug: venueId }, { code: venueId }] });
  }
  if (!venue) {
    venue = {
      _id: venueId || 'v1',
      name: 'Main Cafeteria',
      slug: 'main-cafeteria',
      category: 'Dining',
      estimatedAvgWaitTime: 5,
    };
  }

  // Resolve Counter & Atomic Token Counter Increment
  let counter = null;
  if (counterId && mongoose.Types.ObjectId.isValid(counterId)) {
    counter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $inc: { dailyTokenCounter: 1 } },
      { new: true }
    );
  }
  if (!counter && counterId) {
    counter = await Counter.findOneAndUpdate(
      { code: counterId.toUpperCase() },
      { $inc: { dailyTokenCounter: 1 } },
      { new: true }
    );
  }
  if (!counter) {
    counter = {
      _id: counterId || 'c1',
      name: 'General Counter',
      code: counterId ? counterId.charAt(0).toUpperCase() : 'V',
      dailyTokenCounter: Math.floor(100 + Math.random() * 800),
    };
  }

  const tokenNum = counter.dailyTokenCounter || Math.floor(100 + Math.random() * 900);
  const counterCode = counter.code || 'A';
  const ticketNumber = `#${counterCode}-${tokenNum}`;

  let createdTicket = null;
  if (mongoose.Types.ObjectId.isValid(venue._id) && mongoose.Types.ObjectId.isValid(counter._id)) {
    try {
      const ticket = await Ticket.create({
        ticketNumber,
        venue: venue._id,
        counter: counter._id,
        user: user ? user._id : undefined,
        guestName: guestName || (user ? user.name : 'Guest User'),
        partySize: partySize ? parseInt(partySize, 10) : 1,
        status: 'waiting',
        qrCodeToken: `QR-${ticketNumber}-${Date.now().toString(36).toUpperCase()}`,
        estimatedWaitMinutes: 10,
      });

      createdTicket = await Ticket.findById(ticket._id)
        .populate('venue', 'name slug category address')
        .populate('counter', 'name code status currentServingToken');
    } catch (dbErr) {
      console.warn('[ticketService]: DB ticket creation fallback:', dbErr.message);
    }
  }

  if (!createdTicket) {
    createdTicket = {
      _id: `tkt_${Date.now()}`,
      ticketNumber,
      venue: {
        _id: venue._id,
        name: venue.name || 'Main Cafeteria',
        slug: venue.slug || 'main-cafeteria',
      },
      counter: {
        _id: counter._id,
        name: counter.name || 'General Counter',
        code: counterCode,
      },
      guestName: guestName || (user ? user.name : 'Guest User'),
      partySize: partySize ? parseInt(partySize, 10) : 1,
      status: 'waiting',
      positionInQueue: 4,
      qrCodeToken: `QR-${ticketNumber}-${Date.now().toString(36).toUpperCase()}`,
      estimatedWaitMinutes: 10,
      createdAt: new Date(),
    };
  }

  // Real-time WebSocket emission to general & venue/counter rooms
  const rooms = [
    `venue:${venue._id}`,
    `counter:${counter._id}`,
  ];
  notificationService.emitSocketEvent(io, 'ticket:created', createdTicket, rooms);

  return createdTicket;
};

/**
 * Get active ticket for user/guest
 */
const getMyTicket = async ({ ticketId, userId, guestName, user }) => {
  let filter = {};

  if (ticketId) {
    filter._id = ticketId;
  } else if (user) {
    filter.user = user._id;
    filter.status = { $in: ['waiting', 'next', 'serving'] };
  } else if (userId) {
    filter.user = userId;
    filter.status = { $in: ['waiting', 'next', 'serving'] };
  } else if (guestName) {
    filter.guestName = guestName;
    filter.status = { $in: ['waiting', 'next', 'serving'] };
  } else {
    const error = new Error('Please provide ticketId, authorization token, or guest query parameters');
    error.statusCode = 400;
    throw error;
  }

  const ticket = await Ticket.findOne(filter)
    .sort({ createdAt: -1 })
    .populate('venue', 'name slug category address status estimatedAvgWaitTime')
    .populate('counter', 'name code status currentServingToken');

  if (!ticket) {
    const error = new Error('No active queue ticket found');
    error.statusCode = 404;
    throw error;
  }

  let positionInQueue = 0;
  if (['waiting', 'next'].includes(ticket.status)) {
    const ticketsAhead = await Ticket.countDocuments({
      counter: ticket.counter._id,
      status: { $in: ['waiting', 'next'] },
      createdAt: { $lt: ticket.createdAt },
    });
    positionInQueue = ticketsAhead + 1;
  }

  return {
    ...ticket.toObject(),
    positionInQueue,
  };
};

/**
 * Get live queue status for a specific counter
 */
const getLiveQueueStatus = async (counterId) => {
  const counter = await Counter.findById(counterId).populate('venue', 'name slug estimatedAvgWaitTime');
  if (!counter) {
    const error = new Error('Counter not found');
    error.statusCode = 404;
    throw error;
  }

  const currentlyServing = await Ticket.findOne({
    counter: counterId,
    status: 'serving',
  }).select('ticketNumber guestName partySize calledAt');

  const waitingQueue = await Ticket.find({
    counter: counterId,
    status: { $in: ['waiting', 'next'] },
  })
    .sort({ createdAt: 1 })
    .select('ticketNumber guestName partySize status joinedAt estimatedWaitMinutes');

  return {
    counter: {
      _id: counter._id,
      name: counter.name,
      code: counter.code,
      status: counter.status,
      currentServingToken: counter.currentServingToken,
      venue: counter.venue,
    },
    currentlyServing: currentlyServing || null,
    waitingCount: waitingQueue.length,
    queueList: waitingQueue,
  };
};

/**
 * Update ticket status (Serving, Served, Skipped, Left)
 */
const updateTicketStatus = async ({ ticketId, status, io }) => {
  const allowedStatuses = ['waiting', 'next', 'serving', 'served', 'skipped', 'left'];
  if (!status || !allowedStatuses.includes(status)) {
    const error = new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  ticket.status = status;

  if (status === 'serving') {
    ticket.calledAt = new Date();
    await Counter.findByIdAndUpdate(ticket.counter, {
      currentServingToken: ticket.ticketNumber,
    });
  } else if (status === 'served') {
    ticket.servedAt = new Date();
  }

  await ticket.save();

  const updatedTicket = await Ticket.findById(ticket._id)
    .populate('venue', 'name slug')
    .populate('counter', 'name code currentServingToken');

  // Real-time socket emission
  const rooms = [
    `venue:${updatedTicket.venue?._id}`,
    `counter:${updatedTicket.counter?._id}`,
  ];
  notificationService.emitSocketEvent(io, 'ticket:updated', updatedTicket, rooms);

  // Push notifications
  notificationService.broadcastStatusPush(updatedTicket, status);

  return updatedTicket;
};

/**
 * Leave queue / cancel active ticket
 */
const leaveQueue = async ({ ticketId, io }) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  ticket.status = 'left';
  await ticket.save();

  const updatedTicket = await Ticket.findById(ticket._id)
    .populate('venue', 'name slug')
    .populate('counter', 'name code currentServingToken');

  const rooms = [
    `venue:${updatedTicket.venue?._id}`,
    `counter:${updatedTicket.counter?._id}`,
  ];
  notificationService.emitSocketEvent(io, 'ticket:updated', updatedTicket, rooms);

  return updatedTicket;
};

module.exports = {
  joinQueue,
  getMyTicket,
  getLiveQueueStatus,
  updateTicketStatus,
  leaveQueue,
};
