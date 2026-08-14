const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard analytics summary
 * @route   GET /api/v1/analytics/summary
 * @access  Private (Admin, Superadmin)
 */
const getAnalyticsSummary = async (req, res) => {
  try {
    const analytics = await analyticsService.getSummary();
    return success(res, { analytics });
  } catch (err) {
    console.error('[analyticsController]: getAnalyticsSummary error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getAnalyticsSummary,
};
