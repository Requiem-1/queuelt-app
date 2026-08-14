const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { getVapidPublicKey, sendPushNotification } = require('../utils/push');

/**
 * Get VAPID public key
 */
const getPublicKey = () => {
  return getVapidPublicKey();
};

/**
 * Register web push subscription for user or ticket
 */
const saveSubscription = async ({ subscription, ticketId, userId, currentUser }) => {
  if (!subscription || !subscription.endpoint) {
    const error = new Error('Invalid push subscription payload');
    error.statusCode = 400;
    throw error;
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

  const targetUserId = currentUser ? currentUser._id : userId;
  if (targetUserId) {
    updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { pushSubscription: subscription },
      { new: true }
    );
  }

  // Send instant confirmation push notification
  try {
    await sendPushNotification(subscription, {
      title: 'QueueIt Push Notifications Active! 🔔',
      body: 'You will receive real-time queue alerts when your turn is near.',
      url: '/my-queue',
      tag: 'push-activated',
    });
  } catch (pushErr) {
    console.warn('[notificationService]: Confirmation push failed:', pushErr.message);
  }

  return {
    ticketUpdated: Boolean(updatedTicket),
    userUpdated: Boolean(updatedUser),
  };
};

/**
 * Broadcast ticket push alerts based on status change
 */
const broadcastStatusPush = async (ticket, status) => {
  try {
    const populatedTicket = await Ticket.findById(ticket._id).populate('user');
    const sub =
      populatedTicket?.pushSubscription ||
      (populatedTicket?.user && populatedTicket.user.pushSubscription);

    if (sub) {
      if (status === 'serving') {
        sendPushNotification(sub, {
          title: '🔔 Your turn! Please approach the counter',
          body: `Ticket ${ticket.ticketNumber} is now being served!`,
          url: `/queue/${ticket._id}/status`,
          tag: `callout-${ticket.ticketNumber}`,
        });
      } else if (status === 'next') {
        sendPushNotification(sub, {
          title: "⚡ You're next in line!",
          body: `Ticket ${ticket.ticketNumber} is next. Please head near the counter.`,
          url: `/queue/${ticket._id}/status`,
          tag: `next-${ticket.ticketNumber}`,
        });
      } else if (status === 'skipped') {
        sendPushNotification(sub, {
          title: '⚠️ You were skipped',
          body: `Ticket ${ticket.ticketNumber} missed its turn. Tap to check queue.`,
          url: `/queue/${ticket._id}/status`,
          tag: `skipped-${ticket.ticketNumber}`,
        });
      }
    }

    // Top 3 spot notifications for remaining waiting tickets
    const topWaitingTickets = await Ticket.find({
      counter: ticket.counter,
      status: { $in: ['waiting', 'next'] },
    })
      .sort({ createdAt: 1 })
      .limit(3)
      .populate('user');

    topWaitingTickets.forEach((t, idx) => {
      const tSub = t.pushSubscription || (t.user && t.user.pushSubscription);
      if (tSub) {
        sendPushNotification(tSub, {
          title: `⚡ You're top ${idx + 1} in line!`,
          body: `Ticket ${t.ticketNumber} is position #${idx + 1} at the counter.`,
          url: `/queue/${t._id}/status`,
          tag: `top3-${t.ticketNumber}`,
        });
      }
    });
  } catch (err) {
    console.warn('[notificationService]: Error broadcasting push notifications:', err.message);
  }
};

/**
 * Emit real-time WebSocket events to global & scoped rooms
 */
const emitSocketEvent = (io, event, payload, rooms = []) => {
  if (!io) return;
  // Always emit to global for general subscribers
  io.emit(event, payload);

  // Emit to specific rooms (venue room, counter room)
  if (Array.isArray(rooms)) {
    rooms.forEach((room) => {
      if (room) {
        io.to(room).emit(event, payload);
      }
    });
  }
};

module.exports = {
  getPublicKey,
  saveSubscription,
  broadcastStatusPush,
  emitSocketEvent,
};
