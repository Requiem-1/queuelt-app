const Ticket = require('../models/Ticket');
const Venue = require('../models/Venue');

/**
 * Get aggregated analytics summary
 */
const getSummary = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Total tickets created today
  const totalTicketsToday = await Ticket.countDocuments({
    createdAt: { $gte: startOfDay },
  });

  // Counts by status
  const currentlyServingCount = await Ticket.countDocuments({ status: 'serving' });
  const totalWaitingCount = await Ticket.countDocuments({ status: { $in: ['waiting', 'next'] } });
  const totalServedCount = await Ticket.countDocuments({ status: 'served' });
  const totalSkippedCount = await Ticket.countDocuments({ status: 'skipped' });

  // Average wait time calculation for served tickets today
  const servedTicketsToday = await Ticket.find({
    status: 'served',
    servedAt: { $exists: true },
    createdAt: { $gte: startOfDay },
  });

  let avgWaitTimeMinutes = 12; // default fallback estimate
  if (servedTicketsToday.length > 0) {
    const totalWaitMs = servedTicketsToday.reduce((sum, ticket) => {
      const waitMs = new Date(ticket.servedAt) - new Date(ticket.joinedAt);
      return sum + Math.max(0, waitMs);
    }, 0);
    avgWaitTimeMinutes = Math.round(totalWaitMs / servedTicketsToday.length / 60000);
  }

  // Venue-wise breakdown
  const venues = await Venue.find().select('name slug category');
  const venueBreakdown = await Promise.all(
    venues.map(async (venue) => {
      const total = await Ticket.countDocuments({ venue: venue._id });
      const waiting = await Ticket.countDocuments({ venue: venue._id, status: { $in: ['waiting', 'next'] } });
      const serving = await Ticket.countDocuments({ venue: venue._id, status: 'serving' });
      const served = await Ticket.countDocuments({ venue: venue._id, status: 'served' });

      return {
        _id: venue._id,
        name: venue.name,
        slug: venue.slug,
        category: venue.category,
        totalTickets: total,
        waitingCount: waiting,
        servingCount: serving,
        servedCount: served,
      };
    })
  );

  return {
    totalTicketsToday,
    currentlyServingCount,
    totalWaitingCount,
    totalServedCount,
    totalSkippedCount,
    avgWaitTimeMinutes,
    venueBreakdown,
  };
};

module.exports = {
  getSummary,
};
