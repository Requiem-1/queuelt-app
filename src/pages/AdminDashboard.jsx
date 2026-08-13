import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AddWalkInModal from '../components/admin/AddWalkInModal';
import QRScannerModal from '../components/admin/QRScannerModal';
import QueueQRCode from '../components/QueueQRCode';
import {
  Users,
  Clock,
  CheckCircle,
  UserPlus,
  Pause,
  Play,
  QrCode,
  X,
  Building2,
  ChevronDown,
  UserX,
  ArrowRight,
  Check,
  Sparkles,
  SkipForward,
  RefreshCw,
  Trash2,
  Radio,
  AlertCircle,
} from 'lucide-react';
import socket from '../services/socket';
import api from '../services/api';

const INITIAL_VENUES = [
  { id: 'v1', name: 'Main Cafeteria', code: 'CAF' },
  { id: 'v2', name: 'Gym Desk & Fitness', code: 'GYM' },
  { id: 'v3', name: 'Gourmet Bistro & Grill', code: 'BST' },
  { id: 'v4', name: 'CityCare Medical Clinic', code: 'MED' },
];

const INITIAL_COUNTERS_DATA = {
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

export const AdminDashboard = () => {
  const [selectedVenue, setSelectedVenue] = useState(INITIAL_VENUES[0]);
  const [countersData, setCountersData] = useState(INITIAL_COUNTERS_DATA);
  const [allPaused, setAllPaused] = useState(false);

  // Venue Selector Dropdown Custom State
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const venueDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
        setIsVenueDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      console.log('[AdminDashboard]: Real-time ticket:created received:', newTicket);
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

  // Modals state
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);
  const [resetModalCounter, setResetModalCounter] = useState(null);
  const [qrModalCounter, setQrModalCounter] = useState(null);

  // Current active counters for selected venue
  const activeCounters = countersData[selectedVenue.id] || [];

  // Metrics computation
  const totalWaiting = activeCounters.reduce((acc, c) => acc + c.queue.length, 0);

  const [servedTodayCount, setServedTodayCount] = useState(86);
  const [noShowsCount, setNoShowsCount] = useState(4);

  // Handle Global Pause/Resume All
  const handleTogglePauseAll = () => {
    const nextState = !allPaused;
    setAllPaused(nextState);
    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => ({
        ...c,
        status: nextState ? 'Paused' : 'Active',
      })),
    }));
    showToast(nextState ? 'All counter queues paused' : 'All counter queues resumed');
  };

  // Counter single status toggle (Pause / Resume Counter)
  const handleCounterStatusToggle = (counterId) => {
    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => {
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
  };

  // 1. PRIMARY ACTION: Call Next Customer
  const handleCallNext = async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);
    if (!targetCounter || targetCounter.queue.length === 0) {
      showToast(`No waiting guests in ${targetCounter?.name || 'counter'}`);
      return;
    }

    const [nextGuest, ...remainingQueue] = targetCounter.queue;

    // Send backend API call if nextGuest has MongoDB ID
    if (nextGuest.id && nextGuest.id.length >= 12) {
      try {
        await api.patch(`/tickets/${nextGuest.id}/status`, { status: 'serving' });
      } catch (err) {
        console.warn('[AdminDashboard]: API callNext failed:', err.message);
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
  };

  // 2. PRIMARY ACTION: Skip Token (moves current nowServing to skipped list & prompts next token)
  const handleSkipToken = async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);

    if (!targetCounter || !targetCounter.nowServing) {
      showToast(`No active token to skip in ${targetCounter?.name || 'counter'}`);
      return;
    }

    const currentServing = targetCounter.nowServing;

    // Send backend API call if currentServing has MongoDB ID
    if (currentServing.id && currentServing.id.length >= 12) {
      try {
        await api.patch(`/tickets/${currentServing.id}/status`, { status: 'skipped' });
      } catch (err) {
        console.warn('[AdminDashboard]: API skip failed:', err.message);
      }
    }

    const skippedGuest = {
      ...currentServing,
      skippedAt: 'Just now',
    };

    const updatedSkippedList = [...(targetCounter.skippedList || []), skippedGuest];
    setNoShowsCount((cnt) => cnt + 1);

    if (targetCounter.queue.length > 0) {
      const [nextGuest, ...remainingQueue] = targetCounter.queue;
      if (nextGuest.id && nextGuest.id.length >= 12) {
        try {
          await api.patch(`/tickets/${nextGuest.id}/status`, { status: 'serving' });
        } catch (err) {
          console.warn('[AdminDashboard]: API callNext after skip failed:', err.message);
        }
      }
      const updatedRemaining = remainingQueue.map((item, idx) =>
        idx === 0 ? { ...item, status: 'Next In Line' } : item
      );
      showToast(
        `Skipped token ${currentServing.token}. Automatically calling next: ${nextGuest.name} (${nextGuest.ticket})`
      );
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
            skippedList: updatedSkippedList,
            queue: updatedRemaining,
          };
        }),
      }));
    } else {
      showToast(`Skipped token ${currentServing.token}. No remaining queue.`);
      setCountersData((prev) => ({
        ...prev,
        [venueKey]: (prev[venueKey] || []).map((c) => {
          if (c.id !== counterId) return c;
          return {
            ...c,
            nowServing: null,
            skippedList: updatedSkippedList,
          };
        }),
      }));
    }
  };

  // Mark Currently Serving as Completed / Served
  const handleMarkServed = async (counterId) => {
    const venueKey = selectedVenue.id;
    const currentCounters = countersData[venueKey] || [];
    const targetCounter = currentCounters.find((c) => c.id === counterId);

    if (!targetCounter || !targetCounter.nowServing) return;

    const currentServing = targetCounter.nowServing;

    // Send backend API call if currentServing has MongoDB ID
    if (currentServing.id && currentServing.id.length >= 12) {
      try {
        await api.patch(`/tickets/${currentServing.id}/status`, { status: 'served' });
      } catch (err) {
        console.warn('[AdminDashboard]: API markServed failed:', err.message);
      }
    }

    showToast(`Ticket ${currentServing.token} marked as Served`);
    setServedTodayCount((cnt) => cnt + 1);

    if (targetCounter.queue.length > 0) {
      const [nextGuest, ...remainingQueue] = targetCounter.queue;
      if (nextGuest.id && nextGuest.id.length >= 12) {
        try {
          await api.patch(`/tickets/${nextGuest.id}/status`, { status: 'serving' });
        } catch (err) {
          console.warn('[AdminDashboard]: API callNext after served failed:', err.message);
        }
      }
      const updatedRemaining = remainingQueue.map((item, idx) =>
        idx === 0 ? { ...item, status: 'Next In Line' } : item
      );
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
    } else {
      setCountersData((prev) => ({
        ...prev,
        [venueKey]: (prev[venueKey] || []).map((c) => {
          if (c.id !== counterId) return c;
          return { ...c, nowServing: null };
        }),
      }));
    }
  };

  // 3. PRIMARY ACTION: Reset Queue (Confirm reset for shift end)
  const handleConfirmResetQueue = () => {
    if (!resetModalCounter) return;
    const counterId = resetModalCounter.id;

    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: (prev[selectedVenue.id] || []).map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          nowServing: null,
          queue: [],
          skippedList: [],
        };
      }),
    }));

    showToast(`Queue wiped and reset for ${resetModalCounter.name}`);
    setResetModalCounter(null);
  };

  // 4. USER ACTION ROW: Serve Now (Force out-of-order call)
  const handleServeNowOutOfOrder = async (counterId, queueItemId) => {
    if (queueItemId && queueItemId.length >= 12) {
      try {
        await api.patch(`/tickets/${queueItemId}/status`, { status: 'serving' });
      } catch (err) {
        console.warn('[AdminDashboard]: API serveNowOutOfOrder failed:', err.message);
      }
    }

    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => {
        if (c.id !== counterId) return c;
        const targetGuest = c.queue.find((item) => item.id === queueItemId);
        if (!targetGuest) return c;

        const remainingQueue = c.queue.filter((item) => item.id !== queueItemId);
        const updatedRemaining = remainingQueue.map((item, idx) =>
          idx === 0 ? { ...item, status: 'Next In Line' } : item
        );

        showToast(`Out-of-order call: Serving ${targetGuest.name} (${targetGuest.ticket}) now!`);

        return {
          ...c,
          nowServing: {
            id: targetGuest.id,
            token: targetGuest.ticket,
            name: targetGuest.name,
            party: targetGuest.party,
            calledAt: 'Just now (Out of order)',
          },
          queue: updatedRemaining,
        };
      }),
    }));
  };

  // 5. USER ACTION ROW: Remove / Cancel
  const handleRemoveFromQueue = async (counterId, queueItemId) => {
    if (queueItemId && queueItemId.length >= 12) {
      try {
        await api.delete(`/tickets/${queueItemId}/leave`);
      } catch (err) {
        console.warn('[AdminDashboard]: API remove queue item failed:', err.message);
      }
    }

    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => {
        if (c.id !== counterId) return c;
        const removedItem = c.queue.find((item) => item.id === queueItemId);
        const filtered = c.queue.filter((item) => item.id !== queueItemId);
        const updated = filtered.map((item, idx) =>
          idx === 0 ? { ...item, status: 'Next In Line' } : item
        );
        showToast(`Cancelled ticket ${removedItem?.ticket || ''} (${removedItem?.name || 'Guest'})`);
        return { ...c, queue: updated };
      }),
    }));
  };

  // Re-admit skipped token back to waiting queue
  const handleReadmitSkipped = (counterId, skippedToken) => {
    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => {
        if (c.id !== counterId) return c;
        const updatedSkipped = (c.skippedList || []).filter((s) => s.token !== skippedToken.token);
        const newQueueItem = {
          id: `q-readmit-${Date.now()}`,
          ticket: skippedToken.token,
          name: skippedToken.name,
          party: skippedToken.party,
          wait: '0m',
          status: c.queue.length === 0 ? 'Next In Line' : 'Waiting',
        };
        showToast(`Re-admitted ${skippedToken.name} (${skippedToken.token}) to queue`);
        return {
          ...c,
          skippedList: updatedSkipped,
          queue: [...c.queue, newQueueItem],
        };
      }),
    }));
  };

  // Handle Walk-In Ticket Issued from AddWalkInModal
  const handleWalkInTicketIssued = async (ticketData) => {
    let createdTicket = null;
    try {
      const res = await api.post('/tickets/join', {
        venueId: selectedVenue.mongoId || selectedVenue._id || selectedVenue.id,
        counterId: ticketData.counterId,
        partySize: ticketData.party,
        guestName: ticketData.name,
      });
      if (res && res.ticket) {
        createdTicket = res.ticket;
      }
    } catch (err) {
      console.warn('[AdminDashboard]: API walk-in ticket join fallback:', err.message);
    }

    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: (prev[selectedVenue.id] || []).map((c) => {
        if (c.id !== ticketData.counterId) return c;
        const newGuest = {
          id: createdTicket?._id || `q-walk-${Date.now()}`,
          ticket: createdTicket?.ticketNumber || ticketData.ticket,
          name: createdTicket?.guestName || ticketData.name,
          party: Number(createdTicket?.partySize || ticketData.party),
          wait: `${createdTicket?.estimatedWaitMinutes || 8}m`,
          status: c.queue.length === 0 ? 'Next In Line' : 'Waiting',
        };
        showToast(`Issued Walk-In Ticket ${newGuest.ticket} for ${newGuest.name}`);
        return {
          ...c,
          queue: [...c.queue, newGuest],
        };
      }),
    }));
    return createdTicket;
  };

  // Handle QR Scanner Token Verification & Mark Served
  const handleQRVerifyAndServe = (foundItem) => {
    if (!foundItem || !foundItem.counterId) return;

    setCountersData((prev) => ({
      ...prev,
      [selectedVenue.id]: prev[selectedVenue.id].map((c) => {
        if (c.id !== foundItem.counterId) return c;

        // If it was currently nowServing, mark served and call next
        if (c.nowServing && (c.nowServing.token === foundItem.token || c.nowServing.token === foundItem.ticket)) {
          setServedTodayCount((cnt) => cnt + 1);
          if (c.queue.length > 0) {
            const [nextGuest, ...remainingQueue] = c.queue;
            const updatedRemaining = remainingQueue.map((item, idx) =>
              idx === 0 ? { ...item, status: 'Next In Line' } : item
            );
            return {
              ...c,
              nowServing: {
                token: nextGuest.ticket,
                name: nextGuest.name,
                party: nextGuest.party,
                calledAt: 'Just now',
              },
              queue: updatedRemaining,
            };
          }
          return { ...c, nowServing: null };
        }

        // If it was in waiting queue, remove it & increment served
        setServedTodayCount((cnt) => cnt + 1);
        const remaining = (c.queue || []).filter(
          (q) => q.ticket !== foundItem.token && q.ticket !== foundItem.ticket && q.id !== foundItem.id
        );
        const updatedRemaining = remaining.map((item, idx) =>
          idx === 0 ? { ...item, status: 'Next In Line' } : item
        );
        return {
          ...c,
          queue: updatedRemaining,
        };
      }),
    }));

    showToast(`Token ${foundItem.ticket || foundItem.token} verified & marked as served!`);
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden space-y-8 pb-12">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm shadow-2xl flex items-center gap-3 border border-zinc-700 dark:border-zinc-200">
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header Control Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-200 dark:border-zinc-800/80 pb-6 min-w-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Venue Control Room
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white border border-emerald-500 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Live Engine Active
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time counter management, ticket verification, and queue operations.
          </p>
        </div>

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Venue Selector Custom Floating Dropdown */}
          <div className="relative min-w-[220px]" ref={venueDropdownRef}>
            <button
              type="button"
              onClick={() => setIsVenueDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-sm font-semibold text-zinc-100 transition-all shadow-sm cursor-pointer w-full justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="truncate">{selectedVenue.name}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isVenueDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isVenueDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] z-50 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-200 space-y-0.5">
                {INITIAL_VENUES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVenue(v);
                      showToast(`Switched venue to ${v.name}`);
                      setIsVenueDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      v.id === selectedVenue.id
                        ? 'bg-white/10 text-zinc-100 font-bold'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-100'
                    }`}
                  >
                    <span className="truncate">{v.name}</span>
                    {v.id === selectedVenue.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Venue QR Code Action */}
          <button
            type="button"
            onClick={() =>
              setQrModalCounter({
                type: 'venue',
                venue: selectedVenue,
                url: `${window.location.origin}/venues/${selectedVenue.id}`,
              })
            }
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60 text-sm font-bold transition-all cursor-pointer shadow-xs"
          >
            <QrCode className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Venue QR Code</span>
          </button>

          {/* Pause / Resume All Queues Toggle */}
          <button
            type="button"
            onClick={handleTogglePauseAll}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer shadow-xs ${
              allPaused
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {allPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume All Queues</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause All Queues</span>
              </>
            )}
          </button>

          {/* Add Walk-In Guest Button */}
          <button
            type="button"
            onClick={() => setIsWalkInOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-sm shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Walk-In Guest</span>
          </button>

          {/* Scan Customer QR Button */}
          <button
            type="button"
            onClick={() => setIsQrScanOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 font-medium text-sm transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-zinc-400" />
            <span>Scan Customer QR</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Metric Section (Clean Borderless Grid with Vertical Dividers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 border-y border-zinc-800/60 w-full min-w-0">
        {/* Currently Waiting */}
        <div className="pr-4 lg:border-r lg:border-zinc-800/60 min-w-0 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Currently Waiting
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-extrabold text-zinc-100 tabular-nums">{totalWaiting}</p>
              <span className="text-xs font-normal text-zinc-400">Guests</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-normal mt-1">Across all counters</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/60 text-zinc-300 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Average Wait Time */}
        <div className="px-0 lg:px-4 lg:border-r lg:border-zinc-800/60 min-w-0 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Average Wait Time
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-extrabold text-zinc-100 tabular-nums">11</p>
              <span className="text-xs font-normal text-zinc-400">mins</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-normal mt-1">Optimal throughput</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/60 text-zinc-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Served Today */}
        <div className="pr-4 lg:px-4 lg:border-r lg:border-zinc-800/60 min-w-0 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Served Today
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-extrabold text-zinc-100 tabular-nums">{servedTodayCount}</p>
              <span className="text-xs font-normal text-zinc-400">Customers</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-normal mt-1">+12% vs yesterday</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* No-Shows / Skipped */}
        <div className="pl-0 lg:pl-4 min-w-0 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              No-Shows / Skipped
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-extrabold text-zinc-100 tabular-nums">{noShowsCount}</p>
              <span className="text-xs font-normal text-zinc-400">Guests</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-normal mt-1">Low no-show rate</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/60 text-zinc-300 shrink-0">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Multi-Counter Queue Grid */}
      <div className="space-y-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Active Counters ({activeCounters.length})
          </h2>
          <span className="text-xs font-normal text-zinc-400">
            Showing counters for <strong className="font-bold text-zinc-100">{selectedVenue.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full min-w-0">
          {activeCounters.map((counter) => {
            const isCounterPaused = counter.status === 'Paused';

            return (
              <div
                key={counter.id}
                className={`flex flex-col bg-zinc-900/40 border rounded-2xl overflow-hidden shadow-xs transition-all min-w-0 w-full ${
                  isCounterPaused
                    ? 'border-amber-500/30 ring-1 ring-amber-500/20'
                    : 'border-zinc-800/80'
                }`}
              >
                {/* Counter Header & Primary Controls */}
                <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isCounterPaused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                        }`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-white leading-snug truncate">
                          {counter.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-normal truncate tabular-nums">
                          {counter.queue.length} guests in waiting queue
                        </p>
                      </div>
                    </div>

                    {/* Counter Controls Dropdown & Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Pause / Resume Counter */}
                      <button
                        type="button"
                        onClick={() => handleCounterStatusToggle(counter.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer border transition-all shrink-0 ${
                          isCounterPaused
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:text-white'
                        }`}
                      >
                        {isCounterPaused ? (
                          <>
                            <Play className="w-3 h-3 fill-current shrink-0" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 shrink-0" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>

                      {/* View QR Code Button */}
                      <button
                        type="button"
                        title="View Counter Printable QR Code"
                        onClick={() =>
                          setQrModalCounter({
                            type: 'counter',
                            counter,
                            venue: selectedVenue,
                            url: `${window.location.origin}/venues/${selectedVenue.id}?counter=${counter.id}`,
                          })
                        }
                        className="px-2.5 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/60 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="hidden sm:inline">QR Code</span>
                      </button>

                      {/* Reset Queue Button */}
                      <button
                        type="button"
                        title="Reset Queue for Shift End"
                        onClick={() => setResetModalCounter(counter)}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Paused Broadcast Banner */}
                  {isCounterPaused && (
                    <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                        <span className="truncate">Counter Paused — Broadcast live</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 shrink-0">
                        Frozen
                      </span>
                    </div>
                  )}
                </div>

                {/* Now Serving Token Badge & Primary Actions */}
                <div className="p-5 border-b border-zinc-800/80 bg-zinc-950 text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400 flex items-center justify-between">
                    <span>Now Serving</span>
                    {counter.nowServing && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        Active Token
                      </span>
                    )}
                  </div>

                  {counter.nowServing ? (
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Industrial Monochrome Token Badge */}
                        <div className="inline-block font-mono font-bold tracking-tight px-4 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-xl text-2xl shadow-inner shrink-0 tabular-nums">
                          {counter.nowServing.token}
                        </div>
                        <div className="text-right min-w-0 flex-1 ml-3">
                          <p className="text-sm font-bold text-zinc-100 truncate">{counter.nowServing.name}</p>
                          <p className="text-xs text-zinc-400 font-normal mt-0.5 truncate tabular-nums">
                            Party of {counter.nowServing.party} • {counter.nowServing.calledAt}
                          </p>
                        </div>
                      </div>

                      {/* Primary Action Controls per Counter */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {/* Call Next Customer */}
                        <button
                          type="button"
                          onClick={() => handleCallNext(counter.id)}
                          className="px-2.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Call Next</span>
                        </button>

                        {/* Skip Token */}
                        <button
                          type="button"
                          onClick={() => handleSkipToken(counter.id)}
                          className="px-2.5 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <SkipForward className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Skip Token</span>
                        </button>

                        {/* Served */}
                        <button
                          type="button"
                          onClick={() => handleMarkServed(counter.id)}
                          className="px-2.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Served</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-sm font-semibold text-zinc-400">Counter is Idle</p>
                      <button
                        type="button"
                        onClick={() => handleCallNext(counter.id)}
                        className="mt-3 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span>Call Next Customer</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Waiting Queue List / Tabular 3-Column Queue Rows */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Waiting Queue ({counter.queue.length})
                    </h4>
                    {counter.queue.length > 0 && (
                      <span className="text-[11px] text-zinc-400 font-normal tabular-nums">Est. 12 mins</span>
                    )}
                  </div>

                  {counter.queue.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl">
                      <Users className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                      <p className="text-xs font-normal text-zinc-500">
                        No guests waiting in queue
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 min-w-0">
                      {counter.queue.map((item) => {
                        const user = {
                          id: item.id,
                          name: item.name,
                          tokenNumber: item.ticket || item.tokenNumber,
                          partySize: item.party !== undefined ? item.party : item.partySize,
                          waitTime: item.wait || item.waitTime,
                          status: item.status,
                        };
                        return (
                          <div
                            key={user.id}
                            className="w-full flex items-center justify-between gap-1.5 py-2 px-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors min-w-0"
                          >
                            {/* Token Badge */}
                            <span className="shrink-0 font-mono font-bold text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-100 rounded border border-zinc-700/60">
                              {user.tokenNumber}
                            </span>

                            {/* Info Text (Name + Party + Wait) - Clean Block Flow */}
                            <div className="flex-1 min-w-0 px-1.5">
                              <div className="text-[11px] font-bold text-zinc-100 truncate min-w-0 leading-tight">
                                {user.name || 'Walk-in Guest'}
                              </div>
                              <div className="text-[10px] text-zinc-400 truncate tabular-nums leading-tight">
                                {user.partySize} Guests • {user.waitTime}
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span
                              className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                user.status === 'Next In Line'
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                              }`}
                            >
                              {user.status}
                            </span>

                            {/* Actions */}
                            <div className="shrink-0 flex items-center gap-1 ml-1">
                              <button
                                type="button"
                                title="Serve Now (Force Out-of-Order Call)"
                                onClick={() => handleServeNowOutOfOrder(counter.id, user.id)}
                                className="shrink-0 px-2 py-0.5 text-[10px] font-semibold bg-white text-black hover:bg-zinc-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Serve
                              </button>
                              <button
                                type="button"
                                title="Remove / Cancel Ticket"
                                onClick={() => handleRemoveFromQueue(counter.id, user.id)}
                                className="shrink-0 p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Skipped Tokens Drawer List */}
                  {counter.skippedList && counter.skippedList.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        <span>Skipped Tokens ({counter.skippedList.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {counter.skippedList.map((sItem) => (
                          <div
                            key={sItem.token}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs"
                          >
                            <span className="font-bold text-white">
                              {sItem.token} — {sItem.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReadmitSkipped(counter.id, sItem)}
                              className="text-[10px] font-extrabold text-amber-300 hover:underline cursor-pointer"
                            >
                              Re-admit
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Counter Bottom Action Bar */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={counter.queue.length === 0}
                      onClick={() => handleCallNext(counter.id)}
                      className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Call Next Customer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standalone AddWalkInModal Component */}
      <AddWalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        availableCounters={activeCounters}
        onAddWalkIn={handleWalkInTicketIssued}
      />

      {/* Standalone QRScannerModal Component */}
      <QRScannerModal
        isOpen={isQrScanOpen}
        onClose={() => setIsQrScanOpen(false)}
        activeCounters={activeCounters}
        onVerifyAndServe={handleQRVerifyAndServe}
      />

      {/* MODAL 3: Reset Queue Confirmation Modal */}
      {resetModalCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Reset Counter Queue?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Shift End Reset Action</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
              <p>
                Are you sure you want to reset the active queue for{' '}
                <strong className="text-zinc-900 dark:text-white">{resetModalCounter.name}</strong>?
              </p>
              <ul className="list-disc list-inside font-medium text-zinc-500 dark:text-zinc-400 space-y-1 pt-1">
                <li>Clears currently serving token ({resetModalCounter.nowServing?.token || 'None'})</li>
                <li>Wipes {resetModalCounter.queue.length} waiting guests in queue</li>
                <li>Resets shift counter tracking for this counter</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setResetModalCounter(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetQueue}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirm Reset Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Counter QR Code Modal */}
      {qrModalCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black text-white">Printable Counter QR Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setQrModalCounter(null)}
                className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <QueueQRCode
              url={
                qrModalCounter.url ||
                `${window.location.origin}/venues/${qrModalCounter.venue?.id || selectedVenue?.id}${
                  qrModalCounter.counter ? `?counter=${qrModalCounter.counter.id}` : ''
                }`
              }
              venueSlug={qrModalCounter.venue?.id || selectedVenue?.id}
              counterId={qrModalCounter.counter?.id}
              venueName={qrModalCounter.venue?.name || selectedVenue?.name}
              counterName={
                qrModalCounter.type === 'venue'
                  ? 'Venue Main Entrance QR'
                  : qrModalCounter.counter?.name || 'Counter Service'
              }
              size={220}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
