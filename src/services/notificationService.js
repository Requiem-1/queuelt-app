import api from './api';

/**
 * Push Notification Client Handler for QueueIt
 */

const NOTIFICATION_STORAGE_KEY = 'queueit_notifications_enabled';

// Convert base64 VAPID public key string to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
 * Register web push subscription with the backend server
 */
export const subscribeToWebPush = async (ticketId = null, userId = null) => {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window)
  ) {
    console.warn('Push messaging is not supported in this browser.');
    return false;
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return false;
  }

  try {
    let publicKey =
      'BEi5y3uTMm0nSi0fsVaMiqIig8VrU-V-_PzDuVfnumT-dIdDgfa6y3bel2W0S2-1TdSqxZULzcNKMFdvKAG4zRM';
    try {
      const res = await api.get('/notifications/vapid-public-key');
      if (res && res.publicKey) {
        publicKey = res.publicKey;
      }
    } catch (err) {
      console.warn('Using fallback VAPID key:', err.message);
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const convertedKey = urlBase64ToUint8Array(publicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });
    }

    // Send subscription payload to backend
    await api.post('/notifications/subscribe', {
      subscription: subscription.toJSON ? subscription.toJSON() : subscription,
      ticketId,
      userId,
    });

    return true;
  } catch (error) {
    console.error('Error subscribing to web push notifications:', error);
    return false;
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
  subscribeToWebPush,
  isNotificationEnabled,
  sendLocalNotification,
  notifyTop3Spot,
  notifyCallOut,
  notifySkipped,
};
