const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { getVapidPublicKey, sendPushNotification } = require('../utils/push');

/**
 * @desc    Get VAPID Public Key for client push subscription
 * @route   GET /api/v1/notifications/vapid-public-key
 * @access  Public
 */
const getPublicKey = async (req, res) => {
  try {
    const publicKey = getVapidPublicKey();
    res.json({
      success: true,
      publicKey,
    });
  } catch (error) {
    console.error('[notificationController]: getPublicKey error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch public key' });
  }
};

/**
 * @desc    Save browser web push subscription
 * @route   POST /api/v1/notifications/subscribe
 * @access  Public / User
 */
const subscribePush = async (req, res) => {
  try {
    const { subscription, ticketId, userId } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Invalid push subscription payload',
      });
    }

    let updatedTicket = null;
    let updatedUser = null;

    if (ticketId) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        { pushSubscription: subscription },
        { new: true }
      );
    }

    const currentUserId = req.user ? req.user._id : userId;
    if (currentUserId) {
      updatedUser = await User.findByIdAndUpdate(
        currentUserId,
        { pushSubscription: subscription },
        { new: true }
      );
    }

    // Send instant confirmation push notification
    await sendPushNotification(subscription, {
      title: 'QueueIt Push Notifications Active! 🔔',
      body: 'You will receive real-time queue alerts when your turn is near.',
      url: '/my-queue',
      tag: 'push-activated',
    });

    res.status(200).json({
      success: true,
      message: 'Push notification subscription saved successfully',
      ticketUpdated: Boolean(updatedTicket),
      userUpdated: Boolean(updatedUser),
    });
  } catch (error) {
    console.error('[notificationController]: subscribePush error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error saving push subscription',
      error: error.message,
    });
  }
};

module.exports = {
  getPublicKey,
  subscribePush,
};
