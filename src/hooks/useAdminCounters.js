import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import socket from '../services/socket';
import api from '../services/api';

export const INITIAL_VENUES = [
  { id: 'v1', name: 'Main Cafeteria', code: 'CAF' },
  { id: 'v2', name: 'Gym Desk & Fitness', code: 'GYM' },
  { id: 'v3', name: 'Gourmet Bistro & Grill', code: 'BST' },
  { id: 'v4', name: 'CityCare Medical Clinic', code: 'MED' },
];

export const INITIAL_COUNTERS_DATA = {
  v1: [
    {
      id: 'c1',
      name: 'Veg Counter',
      code: 'V',
      status: 'Active',
      nowServing: { token: '#V-24', name: 'Sarah', party: 2, calledAt: '2 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q1', ticket: '#V-25', name: 'Michael', party: 4, wait: '18m', status: 'Next In Line' },
        { id: 'q2', ticket: '#V-26', name: 'Pam', party: 2, wait: '14m', status: 'Waiting' },
        { id: 'q3', ticket: '#V-27', name: 'Jim', party: 1, wait: '8m', status: 'Waiting' },
        { id: 'q4', ticket: '#V-28', name: 'Dwight', party: 3, wait: '3m', status: 'Waiting' },
      ],
    },
    {
      id: 'c2',
      name: 'Non-Veg Counter',
      code: 'NV',
      status: 'Active',
      nowServing: { token: '#NV-18', name: 'Angela', party: 1, calledAt: '5 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q5', ticket: '#NV-19', name: 'Stanley', party: 2, wait: '12m', status: 'Next In Line' },
        { id: 'q6', ticket: '#NV-20', name: 'Phyllis', party: 4, wait: '7m', status: 'Waiting' },
      ],
    },
    {
      id: 'c3',
      name: 'Beverages & Desserts',
      code: 'BEV',
      status: 'Active',
      nowServing: { token: '#B-42', name: 'Ryan', party: 1, calledAt: '1 min ago' },
      skippedList: [],
      queue: [
        { id: 'q7', ticket: '#B-43', name: 'Kelly', party: 3, wait: '15m', status: 'Next In Line' },
        { id: 'q8', ticket: '#B-44', name: 'Oscar', party: 2, wait: '6m', status: 'Waiting' },
        { id: 'q9', ticket: '#B-45', name: 'Kevin', party: 5, wait: '2m', status: 'Waiting' },
      ],
    },
  ],
  v2: [
    {
      id: 'c4',
      name: 'Personal Trainer Desk',
      code: 'PT',
      status: 'Active',
      nowServing: { token: '#PT-09', name: 'David', party: 1, calledAt: '4 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q10', ticket: '#PT-10', name: 'Toby', party: 1, wait: '10m', status: 'Next In Line' },
      ],
    },
    {
      id: 'c5',
      name: 'Locker Room Check-in',
      code: 'LR',
      status: 'Active',
      nowServing: { token: '#LR-31', name: 'Andy', party: 2, calledAt: '6 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q11', ticket: '#LR-32', name: 'Erin', party: 1, wait: '5m', status: 'Next In Line' },
        { id: 'q12', ticket: '#LR-33', name: 'Gabe', party: 1, wait: '2m', status: 'Waiting' },
      ],
    },
  ],
  v3: [
    {
      id: 'c6',
      name: 'Main Dining Room',
      code: 'MDR',
      status: 'Active',
      nowServing: { token: '#M-12', name: 'Jan', party: 2, calledAt: '3 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q13', ticket: '#M-13', name: 'Roy', party: 4, wait: '22m', status: 'Next In Line' },
      ],
    },
  ],
  v4: [
    {
      id: 'c7',
      name: 'General OPD',
      code: 'OPD',
      status: 'Active',
      nowServing: { token: '#O-88', name: 'Creed', party: 1, calledAt: '8 mins ago' },
      skippedList: [],
      queue: [
        { id: 'q14', ticket: '#O-89', name: 'Meredith', party: 2, wait: '19m', status: 'Next In Line' },
      ],
    },
  ],
};

export const useAdminCounters = (selectedVenue) => {
  const [countersData, setCountersData] = useState(INITIAL_COUNTERS_DATA);
  const [allPaused, setAllPaused] = useState(false);
  const [servedTodayCount, setServedTodayCount] = useState(86);
  const [noShowsCount, setNoShowsCount] = useState(4);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    toast.success(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  }, []);

  // Listen to Socket.io real-time ticket creation
  useEffect(() => {
    const handleTicketCreated = (newTicket) => {
      showToast(`⚡ New ticket ${newTicket.ticketNumber} joined queue!`);

      setCountersData((prev) => {
        const venueKey = selectedVenue.id;
        const currentCounters = prev[venueKey] || prev['v1'] || [];

        const updated = currentCounters.map((c) => {
          const isTargetCounter =
            (newTicket.counter?._id && (c.id === newTicket.counter._id || c.code === newTicket.counter.code)) ||
            c.code === newTicket.counter?.code ||
            c.id === 'c1';

          if (isTargetCounter) {
            const newItem = {
              id: newTicket._id || `q_${Date.now()}`,
              ticket: newTicket.ticketNumber,
              name: newTicket.guestName || 'Guest User',
              party: newTicket.partySize || 1,
              wait: `${newTicket.estimatedWaitMinutes || 8}m`,
              status: c.queue.length === 0 ? 'Next In Line' : 'Waiting',
            };

            return {
              ...c,
              queue: [...c.queue, newItem],
            };
          }
          return c;
        });

        return {
          ...prev,
          [venueKey]: updated,
        };
      });
    };

    socket.on('ticket:created', handleTicketCreated);
    return () => {
      socket.off('ticket:created', handleTicketCreated);
    };
  }, [selectedVenue, showToast]);

  const activeCounters = countersData[selectedVenue.id] || [];
  const totalWaiting = activeCounters.reduce((acc, c) => acc + c.queue.length, 0);

  // Actions
  const handleTogglePauseAll = useCallback(() => {
    const nextState = !allPaused;
    setAllPaused(nextState);
    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: (prev[selectedVenue.id] || []).map((c) => ({
        ...c,
        status: nextState ? 'Paused' : 'Active',
      })),
    }));
    showToast(nextState ? 'All counter queues paused' : 'All counter queues resumed');
  }, [allPaused, selectedVenue.id, showToast]);

  const handleCounterStatusToggle = useCallback((counterId) => {
    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: (prev[selectedVenue.id] || []).map((c) => {
        if (c.id !== counterId) return c;
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        showToast(
          nextStatus === 'Paused'
            ? `Paused counter "${c.name}" & broadcasted banner`
            : `Resumed counter "${c.name}"`
        );
        return { ...c, status: nextStatus };
      }),
    }));
  }, [selectedVenue.id, showToast]);

  const handleCallNext = useCallback(async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);
    if (!targetCounter || targetCounter.queue.length === 0) {
      showToast(`No waiting guests in ${targetCounter?.name || 'counter'}`);
      return;
    }

    const [nextGuest, ...remainingQueue] = targetCounter.queue;

    if (nextGuest.id && nextGuest.id.length >= 12) {
      try {
        await api.patch(`/tickets/${nextGuest.id}/status`, { status: 'serving' });
      } catch (err) {
        console.warn('[useAdminCounters]: API callNext failed:', err.message);
      }
    }

    const updatedRemaining = remainingQueue.map((item, idx) =>
      idx === 0 ? { ...item, status: 'Next In Line' } : item
    );
    showToast(`Ticket ${nextGuest.ticket} updated to Serving`);

    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          nowServing: {
            id: nextGuest.id,
            token: nextGuest.ticket,
            name: nextGuest.name,
            party: nextGuest.party,
            calledAt: 'Just now',
          },
          queue: updatedRemaining,
        };
      }),
    }));
  }, [selectedVenue.id, countersData, showToast]);

  const handleSkipToken = useCallback(async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);
    if (!targetCounter || !targetCounter.nowServing) {
      showToast('No active token serving to skip');
      return;
    }

    const skippedToken = targetCounter.nowServing;

    if (skippedToken.id && skippedToken.id.length >= 12) {
      try {
        await api.patch(`/tickets/${skippedToken.id}/status`, { status: 'skipped' });
      } catch (err) {
        console.warn('[useAdminCounters]: API skipToken failed:', err.message);
      }
    }

    setNoShowsCount((prev) => prev + 1);

    const [nextGuest, ...remainingQueue] = targetCounter.queue;
    const updatedRemaining = remainingQueue.map((item, idx) =>
      idx === 0 ? { ...item, status: 'Next In Line' } : item
    );

    showToast(`Moved ${skippedToken.token} to Skipped List`);

    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          nowServing: nextGuest
            ? {
                id: nextGuest.id,
                token: nextGuest.ticket,
                name: nextGuest.name,
                party: nextGuest.party,
                calledAt: 'Just now',
              }
            : null,
          skippedList: [
            ...c.skippedList,
            { ...skippedToken, skippedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
          queue: updatedRemaining,
        };
      }),
    }));
  }, [selectedVenue.id, countersData, showToast]);

  const handleCompleteToken = useCallback(async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);
    if (!targetCounter || !targetCounter.nowServing) {
      showToast('No active guest being served to complete');
      return;
    }

    const completedServing = targetCounter.nowServing;

    if (completedServing.id && completedServing.id.length >= 12) {
      try {
        await api.patch(`/tickets/${completedServing.id}/status`, { status: 'served' });
      } catch (err) {
        console.warn('[useAdminCounters]: API completeToken failed:', err.message);
      }
    }

    setServedTodayCount((prev) => prev + 1);

    const [nextGuest, ...remainingQueue] = targetCounter.queue;
    const updatedRemaining = remainingQueue.map((item, idx) =>
      idx === 0 ? { ...item, status: 'Next In Line' } : item
    );

    showToast(`Completed service for ${completedServing.token}`);

    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          nowServing: nextGuest
            ? {
                id: nextGuest.id,
                token: nextGuest.ticket,
                name: nextGuest.name,
                party: nextGuest.party,
                calledAt: 'Just now',
              }
            : null,
          queue: updatedRemaining,
        };
      }),
    }));
  }, [selectedVenue.id, countersData, showToast]);

  const handleRequeueSkipped = useCallback((counterId, tokenToRequeue) => {
    const venueKey = selectedVenue.id;
    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        const newQueueItem = {
          id: tokenToRequeue.id || `re_${Date.now()}`,
          ticket: tokenToRequeue.token,
          name: tokenToRequeue.name,
          party: tokenToRequeue.party || 1,
          wait: '5m',
          status: 'Waiting (Rejoined)',
        };
        return {
          ...c,
          skippedList: c.skippedList.filter((s) => s.token !== tokenToRequeue.token),
          queue: [...c.queue, newQueueItem],
        };
      }),
    }));
    showToast(`Re-queued ticket ${tokenToRequeue.token}`);
  }, [selectedVenue.id, showToast]);

  const handleClearSkipped = useCallback((counterId) => {
    const venueKey = selectedVenue.id;
    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        return { ...c, skippedList: [] };
      }),
    }));
    showToast('Skipped list cleared');
  }, [selectedVenue.id, showToast]);

  const handleResetQueue = useCallback((counterId) => {
    const venueKey = selectedVenue.id;
    setCountersData((prev) => ({
      ...prev,
      [venueKey]: (prev[venueKey] || []).map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          nowServing: null,
          queue: [],
          skippedList: [],
        };
      }),
    }));
    showToast('Queue reset successfully');
  }, [selectedVenue.id, showToast]);

  const handleAddWalkIn = useCallback((walkInPayload) => {
    const venueKey = selectedVenue.id;
    const { counterId, name, party, phone, priority } = walkInPayload;

    setCountersData((prev) => {
      const currentCounters = prev[venueKey] || [];
      const updated = currentCounters.map((c) => {
        if (c.id !== counterId) return c;
        const nextNum = Math.floor(50 + Math.random() * 50);
        const newTicket = {
          id: `walk_${Date.now()}`,
          ticket: `#${c.code}-${nextNum}`,
          name: name || 'Walk-in Guest',
          party: Number(party) || 1,
          phone: phone || '',
          priority: Boolean(priority),
          wait: '8m',
          status: c.queue.length === 0 ? 'Next In Line' : 'Waiting',
        };

        const newQueue = priority
          ? [newTicket, ...c.queue]
          : [...c.queue, newTicket];

        return { ...c, queue: newQueue };
      });

      return { ...prev, [venueKey]: updated };
    });

    showToast(`Walk-in ticket generated for ${name || 'Guest'}`);
  }, [selectedVenue.id, showToast]);

  return {
    countersData,
    activeCounters,
    totalWaiting,
    servedTodayCount,
    noShowsCount,
    allPaused,
    toastMessage,
    showToast,
    handleTogglePauseAll,
    handleCounterStatusToggle,
    handleCallNext,
    handleSkipToken,
    handleCompleteToken,
    handleRequeueSkipped,
    handleClearSkipped,
    handleResetQueue,
    handleAddWalkIn,
  };
};

export default useAdminCounters;
