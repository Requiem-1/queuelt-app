import { useState } from 'react';
import { Clock, LogOut, RotateCcw, AlertTriangle } from 'lucide-react';

export const QueueActionButtons = ({
  isServing,
  isCancelled,
  onDelayTicket,
  onLeaveQueue,
  onRejoinQueue,
}) => {
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  if (isCancelled) {
    return (
      <div className="text-center">
        <button
          type="button"
          onClick={onRejoinQueue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs shadow-xs transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Rejoin Waiting Queue</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      {/* Move to Back / I'm Late */}
      {!isServing && (
        <button
          type="button"
          onClick={onDelayTicket}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-all shadow-xs"
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>I'm Running Late (+3 Spots)</span>
        </button>
      )}

      {/* Leave Queue */}
      <button
        type="button"
        onClick={() => setShowConfirmLeave(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Leave Queue</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirmLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Leave Virtual Queue?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You will give up your current position in line. You can always rejoin as a new ticket.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmLeave(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-bold text-xs"
              >
                Keep Spot
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLeave(false);
                  onLeaveQueue();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
              >
                Yes, Leave Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueActionButtons;
