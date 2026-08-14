const notificationService = require('../services/notificationService');
const { error } = require('../utils/apiResponse');

/**
 * @desc    Get VAPID Public Key for client push subscription
 * @route   GET /api/v1/notifications/vapid-public-key
 * @access  Public
 */
const getPublicKey = async (req, res) => {
  try {
    const publicKey = notificationService.getPublicKey();
    return res.json({
      success: true,
      publicKey,
    });
  } catch (err) {
    console.error('[notificationController]: getPublicKey error:', err.message);
    return error(res, 'Failed to fetch public key', 500);
  }
};

/**
 * @desc    Save browser web push subscription
 * @route   POST /api/v1/notifications/subscribe
 * @access  Public / User
 */
const subscribePush = async (req, res) => {
  try {
    const result = await notificationService.saveSubscription({
      subscription: req.body.subscription,
      ticketId: req.body.ticketId,
      userId: req.body.userId,
      currentUser: req.user,
    });

    return res.status(200).json({
      success: true,
      message: 'Push notification subscription saved successfully',
      ticketUpdated: result.ticketUpdated,
      userUpdated: result.userUpdated,
    });
  } catch (err) {
    console.error('[notificationController]: subscribePush error:', err.message);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getPublicKey,
  subscribePush,
};
