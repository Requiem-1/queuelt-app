import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Search, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { mockVenues } from '../../data/mockVenues';

export const QRScannerModal = ({ isOpen = false, onClose = () => {} }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  if (!isOpen) return null;

  const handleLookup = (searchQuery = tokenInput) => {
    let query = searchQuery.trim().toUpperCase();
    if (!query) return;

    // Extract ticket code if a full status URL or encoded parameter was scanned
    if (query.includes('/STATUS/')) {
      const match = query.match(/\/STATUS\/([^?#/]+)/i);
      if (match && match[1]) {
        query = decodeURIComponent(match[1]).toUpperCase();
      }
    } else if (query.includes('TICKET=')) {
      const match = query.match(/TICKET=([^&]+)/i);
      if (match && match[1]) {
        query = decodeURIComponent(match[1]).toUpperCase();
      }
    }

    let foundToken = null;
    let foundCounterName = '';

    for (const venue of mockVenues) {
      for (const counter of venue.countersDetail || []) {
        if (counter.nowServing && counter.nowServing.token.toUpperCase() === query) {
          foundToken = counter.nowServing;
          foundCounterName = counter.name;
          break;
        }
        const queuedItem = (counter.queue || []).find(
          (q) => (q.ticket || q.tokenNumber || '').toUpperCase() === query
        );
        if (queuedItem) {
          foundToken = {
            token: queuedItem.ticket || queuedItem.tokenNumber,
            name: queuedItem.name,
            party: queuedItem.party || queuedItem.partySize || 1,
            calledAt: 'Just Now',
          };
          foundCounterName = counter.name;
          break;
        }
      }
      if (foundToken) break;
    }

    if (foundToken) {
      setVerificationResult({
        success: true,
        message: `Verified Valid Ticket (${foundToken.token})`,
        data: {
          ...foundToken,
          counterName: foundCounterName,
        },
      });
    } else {
      setVerificationResult({
        success: false,
        message: 'Invalid / Unrecognized Ticket',
        query,
      });
    }
  };

  const handleReset = () => {
    setTokenInput('');
    setVerificationResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-6 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700/60">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Live QR Scanner
              </h3>
              <p className="text-xs text-zinc-400 font-normal">
                Optical camera viewfinder &amp; manual token verification engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative w-full h-48 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          <div className="absolute inset-4 border-2 border-dashed border-zinc-700/60 rounded-xl pointer-events-none" />
          
          {scannerActive ? (
            <div className="space-y-2 z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-zinc-300">Optical camera scanner active</p>
              <p className="text-[10px] text-zinc-500 font-normal">Point camera at customer's QueueIt ticket QR code</p>
            </div>
          ) : (
            <div className="space-y-2 z-10">
              <p className="text-xs font-semibold text-zinc-400">Camera paused</p>
              <button
                type="button"
                onClick={() => setScannerActive(true)}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
              >
                Start Camera
              </button>
            </div>
          )}
        </div>

        {/* Quick Test Token Chips */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-400">
            Simulated Scan Shortcuts:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['#V-24', '#V-25', '#NV-18', '#B-42', '#A-104'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setTokenInput(code);
                  handleLookup(code);
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60 hover:bg-zinc-700 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer tabular-nums"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Token Code Lookup Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Manual Ticket ID Verification
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. #V-24)..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-zinc-600"
              />
            </div>
            <button
              type="button"
              onClick={() => handleLookup()}
              className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              Verify Token
            </button>
          </div>
        </div>

        {/* Verification Logic Result Render */}
        {verificationResult && (
          <div className="animate-in fade-in duration-200">
            {verificationResult.success ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-800/60 text-emerald-200 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">
                      {verificationResult.message}
                    </h4>
                    <p className="text-xs text-emerald-400/80 mt-0.5 font-normal">
                      Counter: <strong>{verificationResult.data.counterName}</strong> • Ticket Validated
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-800/40">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                  >
                    Scan Another
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/40 text-rose-300 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">
                      {verificationResult.message}
                    </h4>
                    <p className="text-xs text-rose-400 font-normal">
                      Token "{verificationResult.query}" not found in active queues or already completed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QRScannerModal;
