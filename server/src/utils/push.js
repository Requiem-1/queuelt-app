const webpush = require('web-push');

const vapidPublicKey =
  process.env.VAPID_PUBLIC_KEY ||
  'BEi5y3uTMm0nSi0fsVaMiqIig8VrU-V-_PzDuVfnumT-dIdDgfa6y3bel2W0S2-1TdSqxZULzcNKMFdvKAG4zRM';
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY || 'gDc5jGFzdOQrHMbiionQ-oV9S5m80cv0sGXMNQWIIgc';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@queueit.app';

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} catch (err) {
  console.warn('[web-push]: Error initializing VAPID details:', err.message);
}

/**
 * Send web push notification to a client subscription
 * @param {Object} subscription PushSubscription object ({ endpoint, keys })
 * @param {Object|String} payload Notification payload
 */
const sendPushNotification = async (subscription, payload) => {
  if (!subscription || !subscription.endpoint) {
    return false;
  }

  const payloadString =
    typeof payload === 'string' ? payload : JSON.stringify(payload);

  try {
    await webpush.sendNotification(subscription, payloadString);
    return true;
  } catch (error) {
    console.error('[web-push]: Error sending push notification:', error.message);
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription has expired or is invalid
      return 'expired';
    }
    return false;
  }
};

const getVapidPublicKey = () => vapidPublicKey;

module.exports = {
  webpush,
  sendPushNotification,
  getVapidPublicKey,
};
