import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const LivePositionTracker = ({
  ticketNumber,
  guestName,
  position,
  estimatedWaitMins,
  progressPercent,
  isServing,
  isSkipped,
  isCancelled,
}) => {
  const isNext = position === 1;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs text-center space-y-6">
      {/* Status Banner */}
      {isServing ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-wider">
            Now Serving! Please Approach Counter Immediately
          </span>
        </div>
      ) : isSkipped ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-bold">You were skipped by counter staff. Tap delay or rejoin.</span>
        </div>
      ) : isNext ? (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-black uppercase tracking-wider">
            You are Next in line! Please get ready.
          </span>
        </div>
      ) : isCancelled ? (
        <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center gap-2">
          <span>You have left this queue.</span>
        </div>
      ) : null}

      {/* Big Token Number */}
      <div className="space-y-1">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Your Queue Token
        </span>
        <div className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
          {ticketNumber || '#V-25'}
        </div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Issued for {guestName || 'Guest User'}
        </p>
      </div>

      {/* Position Metrics */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Position in Line</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {isServing ? 'Serving' : `#${position}`}
            </span>
            {!isServing && <span className="text-xs font-semibold text-zinc-500">in queue</span>}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estimated Wait</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {isServing ? '0' : estimatedWaitMins}
            </span>
            <span className="text-xs font-semibold text-zinc-500">mins</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-bold text-zinc-500">
          <span>Queue Progress</span>
          <span>{isServing ? '100%' : `${progressPercent}%`}</span>
        </div>
        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${isServing ? 100 : progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePositionTracker;
