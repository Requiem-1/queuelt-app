const Ticket = require('../models/Ticket');
const Counter = require('../models/Counter');
const Venue = require('../models/Venue');
const { sendPushNotification } = require('../utils/push');

/**
 * @desc    Join queue / Create new ticket
 * @route   POST /api/v1/tickets/join
 * @access  Public / Guest / User
 */
const joinQueue = async (req, res) => {
  try {
    const { venueId, counterId, partySize, guestName } = req.body;

    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: 'venueId is required',
      });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }

    let counter;
    if (counterId) {
      counter = await Counter.findById(counterId);
    } else {
      counter =
        (await Counter.findOne({ venue: venueId, status: 'active' })) ||
        (await Counter.findOne({ venue: venueId }));
    }

    if (!counter) {
      return res.status(404).json({
        success: false,
        message: 'No available counter found for this venue',
      });
    }

    // Atomically increment daily token counter for this counter
    counter.dailyTokenCounter = (counter.dailyTokenCounter || 0) + 1;
    await counter.save();

    const ticketNumber = `${counter.code}-${counter.dailyTokenCounter}`;

    // Calculate waiting tickets ahead
    const waitingTicketsAhead = await Ticket.countDocuments({
      counter: counter._id,
      status: { $in: ['waiting', 'next'] },
    });

    const avgWaitPerTicket = venue.estimatedAvgWaitTime || 10;
    const estimatedWaitMinutes = Math.max(3, waitingTicketsAhead * avgWaitPerTicket);

    let userId = req.user ? req.user._id : undefined;

    const ticket = await Ticket.create({
      ticketNumber,
      venue: venue._id,
      counter: counter._id,
      user: userId,
      guestName: guestName || (req.user ? req.user.name : 'Guest User'),
      partySize: partySize ? parseInt(partySize, 10) : 1,
      status: 'waiting',
      qrCodeToken: `QR-${ticketNumber}-${Date.now().toString(36).toUpperCase()}`,
      estimatedWaitMinutes,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('venue', 'name slug category address')
      .populate('counter', 'name code status currentServingToken');

    // Emit real-time socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('ticket:created', populatedTicket);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully joined the queue!',
      ticket: populatedTicket,
    });
  } catch (error) {
    console.error('[ticketController]: joinQueue error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error joining queue',
      error: error.message,
    });
  }
};

/**
 * @desc    Get active ticket for logged in user or guest
 * @route   GET /api/v1/tickets/my-ticket
 * @access  Public / User
 */
const getMyTicket = async (req, res) => {
  try {
    const { ticketId, userId, guestName } = req.query;

    let filter = {};

    if (ticketId) {
      filter._id = ticketId;
    } else if (req.user) {
      filter.user = req.user._id;
      filter.status = { $in: ['waiting', 'next', 'serving'] };
    } else if (userId) {
      filter.user = userId;
      filter.status = { $in: ['waiting', 'next', 'serving'] };
    } else if (guestName) {
      filter.guestName = guestName;
      filter.status = { $in: ['waiting', 'next', 'serving'] };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide ticketId, authorization token, or guest query parameters',
      });
    }

    const ticket = await Ticket.findOne(filter)
      .sort({ createdAt: -1 })
      .populate('venue', 'name slug category address status estimatedAvgWaitTime')
      .populate('counter', 'name code status currentServingToken');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'No active queue ticket found',
      });
    }

    // Calculate position in queue if waiting or next
    let positionInQueue = 0;
    if (['waiting', 'next'].includes(ticket.status)) {
      const ticketsAhead = await Ticket.countDocuments({
        counter: ticket.counter._id,
        status: { $in: ['waiting', 'next'] },
        createdAt: { $lt: ticket.createdAt },
      });
      positionInQueue = ticketsAhead + 1;
    }

    res.json({
      success: true,
      ticket: {
        ...ticket.toObject(),
        positionInQueue,
      },
    });
  } catch (error) {
    console.error('[ticketController]: getMyTicket error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching ticket',
      error: error.message,
    });
  }
};

/**
 * @desc    Get real-time live queue status for a counter
 * @route   GET /api/v1/tickets/live/:counterId
 * @access  Public
 */
const getLiveQueueStatus = async (req, res) => {
  try {
    const { counterId } = req.params;

    const counter = await Counter.findById(counterId).populate('venue', 'name slug estimatedAvgWaitTime');
    if (!counter) {
      return res.status(404).json({ success: false, message: 'Counter not found' });
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

    res.json({
      success: true,
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
    });
  } catch (error) {
    console.error('[ticketController]: getLiveQueueStatus error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching live queue status',
      error: error.message,
    });
  }
};

/**
 * @desc    Update ticket status (Serving, Served, Skipped, Left)
 * @route   PATCH /api/v1/tickets/:ticketId/status
 * @access  Private (Admin, Superadmin)
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['waiting', 'next', 'serving', 'served', 'skipped', 'left'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = status;

    if (status === 'serving') {
      ticket.calledAt = new Date();
      // Update counter current serving token
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

    // Emit real-time socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('ticket:updated', updatedTicket);
    }

    // Trigger Web Push Notifications for status changes and top 3 alerts
    try {
      const populatedTicketWithUser = await Ticket.findById(ticket._id).populate('user');
      const sub =
        populatedTicketWithUser?.pushSubscription ||
        (populatedTicketWithUser?.user && populatedTicketWithUser.user.pushSubscription);

      if (sub) {
        if (status === 'serving') {
          sendPushNotification(sub, {
            title: '🔔 Your turn! Please approach the counter',
            body: `Ticket ${ticket.ticketNumber} is now being served!`,
            url: `/queue/${ticket._id}/status`,
            tag: `callout-${ticket.ticketNumber}`,
          });
        } else if (status === 'next') {
          sendPushNotification(sub, {
            title: "⚡ You're next in line!",
            body: `Ticket ${ticket.ticketNumber} is next. Please head near the counter.`,
            url: `/queue/${ticket._id}/status`,
            tag: `next-${ticket.ticketNumber}`,
          });
        } else if (status === 'skipped') {
          sendPushNotification(sub, {
            title: '⚠️ You were skipped',
            body: `Ticket ${ticket.ticketNumber} missed its turn. Tap to check queue.`,
            url: `/queue/${ticket._id}/status`,
            tag: `skipped-${ticket.ticketNumber}`,
          });
        }
      }

      // Check remaining waiting tickets for top 3 alerts
      const topWaitingTickets = await Ticket.find({
        counter: ticket.counter,
        status: { $in: ['waiting', 'next'] },
      })
        .sort({ createdAt: 1 })
        .limit(3)
        .populate('user');

      topWaitingTickets.forEach((t, idx) => {
        const tSub = t.pushSubscription || (t.user && t.user.pushSubscription);
        if (tSub) {
          sendPushNotification(tSub, {
            title: `⚡ You're top ${idx + 1} in line!`,
            body: `Ticket ${t.ticketNumber} is position #${idx + 1} at the counter.`,
            url: `/queue/${t._id}/status`,
            tag: `top3-${t.ticketNumber}`,
          });
        }
      });
    } catch (pushErr) {
      console.warn('[ticketController]: Error triggering web push notifications:', pushErr.message);
    }

    res.json({
      success: true,
      message: `Ticket status updated to '${status}'`,
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error('[ticketController]: updateTicketStatus error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating ticket status',
      error: error.message,
    });
  }
};

/**
 * @desc    Leave queue / Cancel active ticket
 * @route   DELETE /api/v1/tickets/:ticketId/leave
 * @access  Public / Guest / User
 */
const leaveQueue = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = 'left';
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('venue', 'name slug')
      .populate('counter', 'name code currentServingToken');

    const io = req.app.get('io');
    if (io) {
      io.emit('ticket:updated', updatedTicket);
    }

    res.json({
      success: true,
      message: 'Successfully left the queue',
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error('[ticketController]: leaveQueue error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error leaving queue',
      error: error.message,
    });
  }
};

module.exports = {
  joinQueue,
  getMyTicket,
  getLiveQueueStatus,
  updateTicketStatus,
  leaveQueue,
};
