import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  Bell,
  XCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  QrCode,
  X,
  Play,
  Pause,
  FastForward,
  ShieldCheck,
  Zap,
  UserX,
  MessageSquare
} from 'lucide-react';
import { mockVenues } from '../data/mockVenues';
import {
  requestNotificationPermission,
  subscribeToWebPush,
  notifyTop3Spot,
  notifyCallOut,
  notifySkipped,
} from '../services/notificationService';

import socket from '../services/socket';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

// Real Scannable QR Code Component
const QRCodeDisplay = ({ tokenId, hash }) => {
  const targetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/queue/status/${encodeURIComponent(tokenId || 'TICKET')}?hash=${encodeURIComponent(hash || '')}`
    : `https://queueit.app/verify/${tokenId || 'TICKET'}`;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-zinc-200 inline-block shadow-lg max-w-[260px] mx-auto space-y-2.5">
      <div className="flex items-center justify-center p-1 bg-white rounded-xl">
        <QRCodeSVG
          value={targetUrl}
          size={180}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
          marginSize={2}
        />
      </div>
      <p className="text-[10px] font-mono text-center font-bold text-black tracking-wider border-t border-zinc-200 pt-2 truncate max-w-[220px] mx-auto">
        {tokenId} &bull; {hash}
      </p>
    </div>
  );
};

export const LiveQueueStatus = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Read state passed from JoinQueueModal or localStorage
  const passedTicket = location.state?.ticket;
  const stateVenue = location.state?.venue;
  const stateCounter = location.state?.counter;
  const passedToken = location.state?.tokenId || passedTicket?.ticketNumber;
  const passedPartySize = location.state?.partySize || 2;

  // Fallback venue lookups
  const venue = stateVenue || mockVenues.find((v) => v.id === id) || mockVenues[0];
  const counterName = stateCounter?.name || 'Main Entry Counter';

  const [tokenId] = useState(() => {
    return passedToken || `#A-${Math.floor(100 + Math.random() * 900)}`;
  });

  const [verificationHash] = useState(() => {
    return passedTicket?.qrCodeToken || `QIT-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`;
  });

  // Live queue state
  const [initialPosition] = useState(5);
  const [position, setPosition] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isNowServing, setIsNowServing] = useState(false);
  const [autoTickerEnabled] = useState(true);
  const [lastSyncedTime, setLastSyncedTime] = useState('Just now');
  const [smsAlertEnabled, setSmsAlertEnabled] = useState(Boolean(location.state?.contactInfo));
  const [adminContactNotice, setAdminContactNotice] = useState(false);

  // Modal dialog states
  const [showLateModal, setShowLateModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Lock body scroll when modal is open to prevent visual glitching
  useEffect(() => {
    if (showQrModal || showLateModal || showLeaveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showQrModal, showLateModal, showLeaveModal]);

  const [ticketData, setTicketData] = useState(passedTicket || null);
  const activeTicketId = ticketData?._id || passedTicket?._id || (id && id.length >= 12 ? id : null);

  const fetchLiveTicket = useCallback(async () => {
    try {
      const queryParam = activeTicketId ? `?ticketId=${activeTicketId}` : '';
      const res = await api.get(`/tickets/my-ticket${queryParam}`);
      if (res && res.ticket) {
        setTicketData(res.ticket);
        if (typeof res.ticket.positionInQueue === 'number') {
          setPosition(res.ticket.positionInQueue);
        }
        if (res.ticket.status === 'serving') {
          setIsNowServing(true);
          setPosition(0);
        } else if (res.ticket.status === 'skipped') {
          setIsSkipped(true);
        } else if (res.ticket.status === 'served' || res.ticket.status === 'left') {
          setIsCancelled(true);
        }
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn('[LiveQueueStatus]: API ticket fetch fallback to local state:', err.message);
    }
  }, [activeTicketId]);

  useEffect(() => {
    let isSubscribed = true;
    const syncTicket = async () => {
      try {
        const queryParam = activeTicketId ? `?ticketId=${activeTicketId}` : '';
        const res = await api.get(`/tickets/my-ticket${queryParam}`);
        if (res && res.ticket && isSubscribed) {
          setTicketData(res.ticket);
          if (typeof res.ticket.positionInQueue === 'number') {
            setPosition(res.ticket.positionInQueue);
          }
          if (res.ticket.status === 'serving') {
            setIsNowServing(true);
            setPosition(0);
          } else if (res.ticket.status === 'skipped') {
            setIsSkipped(true);
          } else if (res.ticket.status === 'served' || res.ticket.status === 'left') {
            setIsCancelled(true);
          }
          setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.warn('[LiveQueueStatus]: API ticket fetch fallback to local state:', err.message);
      }
    };

    syncTicket();
    return () => {
      isSubscribed = false;
    };
  }, [activeTicketId]);

  // Real-Time Socket.io Connection Effect
  useEffect(() => {
    const handleTicketUpdated = (updatedTicket) => {
      console.log('[LiveQueueStatus]: Socket ticket:updated received:', updatedTicket);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const currentTicketId = ticketData?._id || passedTicket?._id;
      if (
        (currentTicketId && updatedTicket._id === currentTicketId) ||
        updatedTicket.ticketNumber === tokenId
      ) {
        if (updatedTicket.status === 'serving') {
          setIsNowServing(true);
          setPosition(0);
          notifyCallOut(counterName, tokenId);
        } else if (updatedTicket.status === 'skipped') {
          setIsSkipped(true);
          notifySkipped(counterName, tokenId);
        } else if (updatedTicket.status === 'served' || updatedTicket.status === 'left') {
          setIsCancelled(true);
        }
      } else {
        fetchLiveTicket();
      }
    };

    const handleTicketCreated = () => {
      fetchLiveTicket();
    };

    socket.on('ticket:updated', handleTicketUpdated);
    socket.on('ticket:created', handleTicketCreated);

    return () => {
      socket.off('ticket:updated', handleTicketUpdated);
      socket.off('ticket:created', handleTicketCreated);
    };
  }, [passedTicket, tokenId, counterName, ticketData, fetchLiveTicket]);

  // Calculated stats
  const waitPerPersonMins = 3;
  const estimatedWaitMins = position * waitPerPersonMins;

  // Progress percentage calculation
  const progressPercent = Math.min(
    100,
    Math.max(15, Math.round(((initialPosition - position) / initialPosition) * 100))
  );

  // Simulated Socket.io Real-Time Queue Ticker Effect
  useEffect(() => {
    if (!autoTickerEnabled || isPaused || isCancelled || isSkipped || position <= 0) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0; // Now Serving
        }
        return prev - 1;
      });
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 7000);

    return () => clearInterval(interval);
  }, [autoTickerEnabled, isPaused, isCancelled, isSkipped, position]);

  // Web Audio API Synthesized Audio Chime Ping
  const playChimeSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.7);
    } catch {
      // AudioContext blocked by browser autoplay policy
    }
  };

  // 1. Web Push Notification & Audio Chime Triggers (Top 3 spot, Call out, and Skipped)
  useEffect(() => {
    if (isCancelled || isPaused) return;

    if (isSkipped) {
      notifySkipped(counterName, tokenId);
      return;
    }

    if (position === 0) {
      notifyCallOut(counterName, tokenId);
      playChimeSound();
      return;
    }

    if (position <= 3 && position > 0) {
      notifyTop3Spot(counterName, position, tokenId);
      playChimeSound();
    }
  }, [position, isCancelled, isSkipped, isPaused, counterName, tokenId]);

  // Determine status badge label & styling
  const getStatusBadge = () => {
    if (isSkipped) {
      return {
        label: 'Skipped / Missed Turn',
        style: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800/40',
      };
    }
    if (isCancelled) {
      return {
        label: 'Cancelled / Left Queue',
        style: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700/50 line-through',
      };
    }
    if (isPaused) {
      return {
        label: 'Queue Paused',
        style: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40',
      };
    }
    if (position === 0 || isNowServing) {
      return {
        label: 'Now Serving - Proceed to Counter!',
        style: 'bg-emerald-600 text-white border border-emerald-500 font-extrabold shadow-xs',
      };
    }
    if (position <= 2) {
      return {
        label: 'Top 3 - Near Front',
        style: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 font-extrabold',
      };
    }
    return {
      label: 'In Line',
      style: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40',
    };
  };

  const statusBadge = getStatusBadge();

  // Action Handlers
  const handleConfirmLate = () => {
    setPosition(8);
    setShowLateModal(false);
    toast.success('Moved to end of queue');
  };

  const handleConfirmLeave = async () => {
    setShowLeaveModal(false);
    try {
      const activeId = ticketData?._id || passedTicket?._id || id;
      if (activeId && activeId.length >= 12) {
        await api.delete(`/tickets/${activeId}/leave`);
      }
    } catch (err) {
      console.warn('[LiveQueueStatus]: API leave queue fallback:', err.message);
    }
    setIsCancelled(true);
    toast.success('You have left the queue');
    navigate('/', { replace: true });
  };

  const handleRejoinFromSkipped = () => {
    setIsSkipped(false);
    setPosition(5);
    toast.success('Rejoined virtual queue successfully!');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Return Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>

      {/* Main Ticket & Tracker Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 text-center space-y-6 shadow-xl dark:shadow-none"
      >
        
        {/* 1. Hero Ticket Card Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs transition-all ${statusBadge.style}`}
            >
              {!isCancelled && !isPaused && !isSkipped && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
              {statusBadge.label}
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
              {venue.name}
            </p>
            <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
              {counterName}
            </h2>
          </div>

          {/* Industrial Token Number Badge */}
          <div className="py-2">
            <span className="font-mono font-bold tracking-tight px-6 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700/60 rounded-2xl text-4xl sm:text-5xl shadow-inner inline-block tabular-nums">
              {tokenId}
            </span>
          </div>
        </div>

        {/* --- SMART ALERT BANNERS --- */}

        {/* 1. Near Front Alert Banner (Top 3) */}
        {position <= 3 && position > 0 && !isCancelled && !isSkipped && !isPaused && (
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-500/30 dark:border-amber-800/40 shadow-xs flex items-center justify-between text-left gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-300 fill-current" />
              <div>
                <p className="text-sm font-black tracking-tight">
                  ⚡ Please head towards the counter!
                </p>
                <p className="text-xs font-medium opacity-90 tabular-nums">
                  Your turn is near (#{position} in line). Get ready for check-in.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Queue Paused Banner */}
        {isPaused && !isCancelled && !isSkipped && (
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 shadow-md flex items-center gap-3 text-left">
            <Pause className="w-5 h-5 shrink-0 text-amber-500 dark:text-amber-400" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Queue Status</p>
              <p className="text-sm font-bold mt-0.5">
                ⏸️ Queue is temporarily paused by the manager. Hold tight!
              </p>
            </div>
          </div>
        )}

        {/* 3. Skipped / Missed Turn Recovery Card */}
        {isSkipped ? (
          <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 space-y-4 text-left">
            <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
              <UserX className="w-6 h-6 shrink-0 text-rose-500 dark:text-rose-400" />
              <div>
                <h3 className="text-base font-black">Missed Turn / Skipped</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tabular-nums">
                  Your token ({tokenId}) was called at {counterName} but skipped.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Don't worry! You can rejoin the virtual queue or request assistance from the counter manager.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleRejoinFromSkipped}
                className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-xs transition-all rounded-xl px-4 py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejoin Queue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminContactNotice(true);
                  toast.success('Counter admin notified! Stand by for assistance.');
                }}
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 font-medium rounded-xl px-4 py-2.5 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <span>{adminContactNotice ? 'Admin Notified ✓' : 'Contact Admin'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Line Progress Tracker */
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Live Queue Tracker
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300 tabular-nums">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Live Syncing ({lastSyncedTime})
              </span>
            </div>

            {/* Dynamic Queue Message */}
            <div className="text-center py-2">
              {position > 1 && (
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                  You are <span className="underline text-amber-600 dark:text-amber-300 decoration-2 underline-offset-4">#{position}</span> in line
                </h3>
              )}
              {position === 1 && (
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-300" /> You're up next! Get ready.
                </h3>
              )}
              {position === 0 && (
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Now Serving! Proceed to Counter.
                </h3>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-zinc-900 dark:bg-white h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                <span>Joined: Position #{initialPosition}</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-extrabold">{progressPercent}% Completed</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Live Stats Grid (ETA & Party Size) */}
        {!isSkipped && (
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
              <Clock className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mb-1" />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase">Estimated Remaining</p>
              <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                {position > 0 ? `~${estimatedWaitMins} Mins` : '0 Mins (Ready)'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
              <Users className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mb-1" />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase">Party Size</p>
              <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                {passedPartySize} Guests
              </p>
            </div>
          </div>
        )}

        {/* Interactive Action Controls */}
        <div className="space-y-3 pt-2">
          {/* Show Validation QR Code Button */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-xs transition-all rounded-xl px-4 py-2.5 w-full flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <QrCode className="w-5 h-5" />
            <span>Show Validation QR Code</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {/* I'm Late Button */}
            <button
              type="button"
              onClick={() => setShowLateModal(true)}
              disabled={position === 0 || isCancelled || isSkipped}
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 font-medium rounded-xl px-4 py-2.5 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>I'm Late</span>
            </button>

            {/* Push / Web Notification Toggle */}
            <button
              type="button"
              onClick={async () => {
                const nextState = !smsAlertEnabled;
                setSmsAlertEnabled(nextState);
                if (nextState) {
                  const activeTicketId = ticketData?._id || passedTicket?._id || id;
                  const success = await subscribeToWebPush(activeTicketId);
                  if (success) {
                    toast.success('Web Push Notifications enabled!');
                  } else {
                    const perm = await requestNotificationPermission();
                    if (perm === 'granted') {
                      notifyTop3Spot(counterName, position, tokenId);
                    }
                  }
                }
              }}
              className={`py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                smsAlertEnabled
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>{smsAlertEnabled ? 'Alerts Active ✓' : 'Enable Push Alerts'}</span>
            </button>
          </div>

          {/* Leave Queue Button */}
          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            className="w-full py-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Leave Queue</span>
          </button>
        </div>

        {/* Developer Real-Time Simulator Bar */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Dev Ticker &amp; State Simulator</span>
            <span>Interval: {autoTickerEnabled ? 'Auto (7s)' : 'Manual'}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPosition((prev) => Math.max(0, prev - 1))}
              disabled={position <= 0 || isCancelled || isSkipped}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <FastForward className="w-3.5 h-3.5" /> Next
            </button>

            <button
              type="button"
              onClick={() => setPosition(0)}
              disabled={position === 0 || isCancelled || isSkipped}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Serve
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              disabled={isCancelled || isSkipped}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              type="button"
              onClick={() => setIsSkipped(!isSkipped)}
              disabled={isCancelled}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <UserX className="w-3.5 h-3.5" /> Skip
            </button>
          </div>
        </div>

      </motion.div>

      {/* 1. "I'm Late" Confirmation Modal */}
      {showLateModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowLateModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Running Late?</h3>
                <p className="text-xs font-bold text-zinc-400">Rejoin back of queue</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 text-left leading-relaxed">
              Running late? Rejoin the back of the queue without losing your session. Your position will reset to the end of the line and your ETA will be updated automatically.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLate}
                className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Rejoin Back of Line
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 2. "Leave Queue" Confirmation Modal */}
      {showLeaveModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowLeaveModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Leave Virtual Queue?</h3>
                <p className="text-xs font-bold text-zinc-400">Confirm cancellation</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 text-left leading-relaxed">
              Are you sure you want to leave the queue? You will lose your spot and will need to get a new token if you wish to return.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Keep My Spot
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Yes, Leave Queue
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. Validation QR Code Modal */}
      {showQrModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowQrModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                  {venue.name}
                </span>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Counter Validation QR Code
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Graphic */}
            <div className="py-2">
              <QRCodeDisplay tokenId={tokenId} hash={verificationHash} />
            </div>

            {/* Scanner Note */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-2 text-left">
              <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-white shrink-0" />
              <span>Scan this QR code at the service counter when your turn arrives.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-sm shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Sticky Mobile Quick-Access Ticket Banner */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/95 border border-zinc-800 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono font-black text-sm px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 tabular-nums shrink-0">
            {tokenId}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black text-white truncate">{counterName}</p>
            <p className="text-[10px] text-amber-300 font-bold truncate">
              {position === 0 ? 'Now Serving!' : `${position} guests ahead`}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setShowQrModal(true)}
          className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Code</span>
        </motion.button>
      </div>
    </div>
  );
};

export default LiveQueueStatus;
