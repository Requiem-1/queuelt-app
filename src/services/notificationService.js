/**
 * Push Notification Client Handler for QueueIt
 */

const NOTIFICATION_STORAGE_KEY = 'queueit_notifications_enabled';

/**
 * Trigger native browser Notification.requestPermission()
 * Stores user choice in localStorage.
 */
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Browser does not support desktop notifications.');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    const isGranted = permission === 'granted';
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, isGranted ? 'true' : 'false');
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
};

/**
 * Check if notifications are supported, granted, and enabled
 */
export const isNotificationEnabled = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  return Notification.permission === 'granted';
};

/**
 * Core helper function to send a native browser Notification.
 * Fires whether window is visible or backgrounded when permission is granted.
 */
export const sendLocalNotification = (title, body, options = {}) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;

  if (Notification.permission === 'granted') {
    try {
      const defaultIcon = '/favicon.svg';
      const notification = new Notification(title, {
        body,
        icon: options.icon || defaultIcon,
        badge: '/favicon.svg',
        tag: options.tag || 'queueit-notification',
        renotify: true,
        vibrate: [200, 100, 200],
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        if (options.url) {
          window.location.href = options.url;
        }
        notification.close();
      };

      return notification;
    } catch (err) {
      console.warn('Error creating native Notification instance:', err);
    }
  }

  return null;
};

// --- PRE-CONFIGURED NOTIFICATION TEMPLATES ---

/**
 * 1. Top 3 Spot Alert
 * Template: "⚡ You're top 3 in line for Veg Counter!"
 */
export const notifyTop3Spot = (counterName = 'the counter', position = 3, tokenNumber = '') => {
  const title = `⚡ You're top 3 in line for ${counterName}!`;
  const body = `Position #${position} in line. Please get ready and approach the counter soon.`;
  return sendLocalNotification(title, body, {
    tag: `top3-${tokenNumber}`,
    icon: '/favicon.svg',
  });
};

/**
 * 2. Call Out Alert
 * Template: "🔔 Your turn! Please approach the counter."
 */
export const notifyCallOut = (counterName = 'the counter', tokenNumber = '') => {
  const title = `🔔 Your turn! Please approach ${counterName}.`;
  const body = `Token ${tokenNumber} is now being served! Head over to the counter immediately.`;
  return sendLocalNotification(title, body, {
    tag: `callout-${tokenNumber}`,
    icon: '/favicon.svg',
  });
};

/**
 * 3. Skipped Alert
 * Template: "⚠️ You were skipped. Tap to rejoin."
 */
export const notifySkipped = (counterName = 'the counter', tokenNumber = '') => {
  const title = `⚠️ You were skipped at ${counterName}.`;
  const body = `Token ${tokenNumber} missed their turn. Tap to rejoin the queue.`;
  return sendLocalNotification(title, body, {
    tag: `skipped-${tokenNumber}`,
    icon: '/favicon.svg',
  });
};

export default {
  requestNotificationPermission,
  isNotificationEnabled,
  sendLocalNotification,
  notifyTop3Spot,
  notifyCallOut,
  notifySkipped,
};
