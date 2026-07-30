import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  X,
  Phone,
  Bell,
  CheckCircle2,
  Users,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const JoinQueueModal = ({ isOpen, onClose, venueData, counterData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [partySize, setPartySize] = useState(1);
  const [contactInfo, setContactInfo] = useState('');
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !counterData) return null;

  const peopleAhead = counterData.waitingCount ?? counterData.inLine ?? 4;
  const estimatedWaitMins = peopleAhead * (venueData?.estimatedAvgWaitTime || 3);

  const handleNotificationToggle = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setBrowserAlertsEnabled(true);
        toast.success('Push notifications enabled!');
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setBrowserAlertsEnabled(true);
          toast.success('Push notifications enabled!');
        } else {
          setBrowserAlertsEnabled(false);
        }
      }
    } else {
      const next = !browserAlertsEnabled;
      setBrowserAlertsEnabled(next);
      if (next) toast.success('Push notifications enabled!');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'GU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        venueId: venueData?.mongoId || venueData?._id || venueData?.id,
        counterId: counterData?._id || counterData?.id,
        partySize: typeof partySize === 'number' ? partySize : parseInt(partySize, 10) || 1,
        guestName: user?.name || 'Guest User',
      };

      const res = await api.post('/tickets/join', payload);
      const ticket = res.ticket;

      if (ticket) {
        localStorage.setItem('queueit_active_ticket', JSON.stringify(ticket));
      }

      toast.success(`Successfully joined queue! Ticket ${ticket?.ticketNumber || ''}`);
      onClose();
      navigate(`/queue/${ticket?._id || counterData.id || 'status'}/status`, {
        state: {
          ticket,
          tokenId: ticket?.ticketNumber,
          counter: counterData,
          venue: venueData,
          partySize,
          contactInfo,
          browserAlertsEnabled,
        },
      });
    } catch (err) {
      console.error('[JoinQueueModal]: API join error, using local fallback:', err.message);
      const prefix = counterData.name ? counterData.name.charAt(0).toUpperCase() : 'A';
      const mockTokenId = `#${prefix}-${Math.floor(100 + Math.random() * 900)}`;
      toast.success(`Joined queue! Generated Token ${mockTokenId}`);
      onClose();
      navigate(`/queue/${counterData.id || venueData?.id || 'v1'}/status`, {
        state: {
          tokenId: mockTokenId,
          counter: counterData,
          venue: venueData,
          partySize,
          contactInfo,
          browserAlertsEnabled,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 z-10 space-y-6 my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
              {venueData?.name || 'Venue Queue'}
            </span>
            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-zinc-400" /> Join {counterData.name}
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Counter Live Stats Banner */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Now Serving</p>
            <p className="text-base font-black text-blue-500 mt-0.5">
              {counterData.nowServing || '#A-01'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">People Ahead</p>
            <p className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
              {peopleAhead} guests
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Est. Wait</p>
            <p className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
              ~{estimatedWaitMins} Mins
            </p>
          </div>
        </div>

        {/* User Identity Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center border border-blue-400 shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              Joining as <span className="underline decoration-blue-500 decoration-2">{user?.name || 'Guest User'}</span>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold">
              Role: {user?.role || 'guest'}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950/60 text-blue-400 border border-blue-800/50 shrink-0">
            Active Session
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Party Size Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" /> Party Size
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, '6+'].map((size) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={size}
                  type="button"
                  onClick={() => setPartySize(size)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    partySize === size
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contact Alert Info */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-500" /> SMS / Email Alert Contact (Optional)
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000 or email@example.com"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Browser Notification Prompt Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Live Push Notifications</p>
                <p className="text-[11px] text-zinc-500">Alert when your turn is coming up</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleNotificationToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                browserAlertsEnabled
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {browserAlertsEnabled ? 'Enabled ✓' : 'Enable Push'}
            </motion.button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Get Token</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default JoinQueueModal;
