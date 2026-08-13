import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  X,
  Ticket,
  Printer,
  CheckCircle2,
  Phone,
  Building2,
  RotateCcw,
  QrCode,
} from 'lucide-react';

export const AddWalkInModal = ({
  isOpen,
  onClose,
  availableCounters = [],
  onAddWalkIn,
}) => {
  const [targetCounterId, setTargetCounterId] = useState('');
  const [guestName, setGuestName] = useState('Walk-in Guest');
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState('');
  const [issuedTicket, setIssuedTicket] = useState(null);

  if (!isOpen) return null;

  const activeCounterId = targetCounterId || availableCounters[0]?.id || '';

  const handleIssueTicket = async (e) => {
    e.preventDefault();
    const selectedCounter = availableCounters.find((c) => c.id === activeCounterId) || availableCounters[0];
    if (!selectedCounter) return;

    const code = selectedCounter.code || 'W';
    const queueLen = (selectedCounter.queue ? selectedCounter.queue.length : 0) + 1;
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedToken = `#${code}-${randomNum}`;

    const newTicketData = {
      ticket: generatedToken,
      counterId: selectedCounter.id,
      counterName: selectedCounter.name,
      name: guestName.trim() || 'Walk-in Guest',
      party: Number(partySize) || 1,
      phone: phone.trim(),
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estWait: `${queueLen * 4} mins`,
    };

    if (onAddWalkIn) {
      const created = await onAddWalkIn(newTicketData);
      if (created) {
        setIssuedTicket({
          ...newTicketData,
          ticket: created.ticketNumber || generatedToken,
          estWait: `${created.estimatedWaitMinutes || 8} mins`,
        });
        return;
      }
    }

    setIssuedTicket(newTicketData);
  };

  const handleResetForAnother = () => {
    setIssuedTicket(null);
    setGuestName('Walk-in Guest');
    setPartySize(2);
    setPhone('');
  };

  const handleCloseAll = () => {
    setIssuedTicket(null);
    setGuestName('Walk-in Guest');
    setPartySize(2);
    setPhone('');
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-6 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700/60">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {issuedTicket ? 'Walk-In Ticket Issued' : 'Issue Walk-In Ticket'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {issuedTicket
                  ? 'Printable token receipt for walk-in customer'
                  : 'Fast-track guest registration into active counter queue'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Form Inputs */}
        {!issuedTicket ? (
          <form onSubmit={handleIssueTicket} className="space-y-4">
            {/* 1. Target Counter Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                <span>Select Target Counter Queue *</span>
                <span className="text-[11px] font-normal text-blue-400 font-semibold">
                  {availableCounters.length} Counters Available
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={activeCounterId}
                  onChange={(e) => setTargetCounterId(e.target.value)}
                  required
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {availableCounters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.queue ? c.queue.length : 0} waiting)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Guest Name or Handle */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Guest Name or Handle
              </label>
              <input
                type="text"
                placeholder="e.g. Walk-in Guest or Alex"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 3. Party Size selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Party Size
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPartySize(num)}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      partySize === num
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {num === 6 ? '6+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Phone Number (Optional) */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Phone Number (Optional for SMS Ticket Notification)</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Issue Walk-In Ticket</span>
              </button>
            </div>
          </form>
        ) : (
          /* View 2: Printable/Viewable Receipt Badge */
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-5 text-center shadow-xl relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-white to-blue-500"></div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 text-xs font-bold border border-blue-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Ticket Issued &amp; Added to Queue</span>
              </div>

              {/* Large Ticket Badge */}
              <div>
                <div className="text-4xl font-black tracking-widest text-blue-400 mt-1">
                  {issuedTicket.ticket}
                </div>
                <p className="text-xs text-zinc-400 font-bold mt-1 uppercase tracking-wider">
                  {issuedTicket.counterName}
                </p>
              </div>

              {/* Ticket Details Box */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left text-xs space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Customer:</span>
                  <span className="font-bold text-white">{issuedTicket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Party Size:</span>
                  <span className="font-bold text-white">{issuedTicket.party} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Issued Time:</span>
                  <span className="font-bold text-white">{issuedTicket.issuedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Wait:</span>
                  <span className="font-bold text-blue-400">{issuedTicket.estWait}</span>
                </div>
                {issuedTicket.phone && (
                  <div className="flex justify-between border-t border-zinc-800 pt-2 text-[11px] text-zinc-400">
                    <span>SMS Notification:</span>
                    <span className="font-bold text-zinc-200">Sent to {issuedTicket.phone}</span>
                  </div>
                )}
              </div>

              {/* Visual QR Code Mock */}
              <div className="flex items-center justify-center gap-2 pt-1 text-zinc-500 text-[11px]">
                <QrCode className="w-5 h-5 text-blue-400" />
                <span>Digital Pass Code Active</span>
              </div>
            </div>

            {/* Receipt Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleResetForAnother}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Another</span>
              </button>

              <button
                type="button"
                onClick={handleCloseAll}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddWalkInModal;
