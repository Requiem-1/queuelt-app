const Venue = require('../models/Venue');
const Counter = require('../models/Counter');
const Ticket = require('../models/Ticket');

/**
 * @desc    Get all venues
 * @route   GET /api/v1/venues
 * @access  Public
 */
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });

    // Fetch counter counts, names & waiting ticket stats for each venue
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

    res.json({
      success: true,
      count: enrichedVenues.length,
      venues: enrichedVenues,
    });
  } catch (error) {
    console.error('[venueController]: getVenues error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching venues',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single venue by slug with populated counters & live stats
 * @route   GET /api/v1/venues/:slug
 * @access  Public
 */
const getVenueBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const venue = await Venue.findOne({ slug: slug.toLowerCase() });
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: `Venue with slug '${slug}' not found`,
      });
    }

    // Fetch counters for this venue
    const counters = await Counter.find({ venue: venue._id }).sort({ name: 1 });

    // Populate live queue metrics for each counter
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

    res.json({
      success: true,
      venue: {
        ...venue.toObject(),
        totalWaitingTickets: totalWaiting,
        counters: countersWithStats,
      },
    });
  } catch (error) {
    console.error('[venueController]: getVenueBySlug error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching venue details',
      error: error.message,
    });
  }
};

module.exports = {
  getVenues,
  getVenueBySlug,
};
