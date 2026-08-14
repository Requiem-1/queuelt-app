const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const Counter = require('../models/Counter');
const Ticket = require('../models/Ticket');

/**
 * Get all venues with enriched counter and queue counts
 */
const getAllVenues = async () => {
  const venues = await Venue.find().sort({ createdAt: -1 });

  const enrichedVenues = await Promise.all(
    venues.map(async (venue) => {
      const venueCounters = await Counter.find({ venue: venue._id }).select('name');
      const waitingTicketsCount = await Ticket.countDocuments({
        venue: venue._id,
        status: { $in: ['waiting', 'next'] },
      });

      return {
        ...venue.toObject(),
        totalCounters: venueCounters.length,
        counters: venueCounters.map((c) => c.name),
        activeQueueCount: waitingTicketsCount,
      };
    })
  );

  return enrichedVenues;
};

/**
 * Get single venue by slug or ID with populated counters & live statistics
 */
const getVenueBySlug = async (slug) => {
  let venue;
  if (mongoose.Types.ObjectId.isValid(slug)) {
    venue = await Venue.findOne({ $or: [{ slug: slug.toLowerCase() }, { _id: slug }] });
  } else {
    venue = await Venue.findOne({ slug: slug.toLowerCase() });
  }

  if (!venue) {
    const error = new Error(`Venue with slug or ID '${slug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const counters = await Counter.find({ venue: venue._id }).sort({ name: 1 });

  const countersWithStats = await Promise.all(
    counters.map(async (counter) => {
      const waitingCount = await Ticket.countDocuments({
        counter: counter._id,
        status: { $in: ['waiting', 'next'] },
      });

      const currentServingTicket = await Ticket.findOne({
        counter: counter._id,
        status: 'serving',
      }).select('ticketNumber guestName calledAt');

      return {
        ...counter.toObject(),
        waitingCount,
        currentServingTicket: currentServingTicket || null,
      };
    })
  );

  const totalWaiting = countersWithStats.reduce((sum, c) => sum + c.waitingCount, 0);

  return {
    ...venue.toObject(),
    totalWaitingTickets: totalWaiting,
    counters: countersWithStats,
  };
};

module.exports = {
  getAllVenues,
  getVenueBySlug,
};
