const venueService = require('../services/venueService');
const { error } = require('../utils/apiResponse');

/**
 * @desc    Get all venues
 * @route   GET /api/v1/venues
 * @access  Public
 */
const getVenues = async (req, res) => {
  try {
    const venues = await venueService.getAllVenues();
    return res.json({
      success: true,
      count: venues.length,
      venues,
    });
  } catch (err) {
    console.error('[venueController]: getVenues error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

/**
 * @desc    Get single venue by slug with populated counters & live stats
 * @route   GET /api/v1/venues/:slug
 * @access  Public
 */
const getVenueBySlug = async (req, res) => {
  try {
    const venue = await venueService.getVenueBySlug(req.params.slug);
    return res.json({
      success: true,
      venue,
    });
  } catch (err) {
    console.error('[venueController]: getVenueBySlug error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getVenues,
  getVenueBySlug,
};
