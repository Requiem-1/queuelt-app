import {
  Users,
  Play,
  Pause,
  QrCode,
  SkipForward,
  Check,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';

export const CounterCard = ({
  counter,
  onCallNext,
  onSkipToken,
  onCompleteToken,
  onToggleStatus,
  onRequeueSkipped,
  onClearSkipped,
  onOpenQrModal,
  onOpenResetModal,
}) => {
  const isPaused = counter.status === 'Paused';
  const nowServing = counter.nowServing;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs backdrop-blur-xl ${
        isPaused
          ? 'bg-zinc-100/60 dark:bg-zinc-900/40 border-amber-500/30'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black text-xs">
            {counter.code}
          </span>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
              {counter.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isPaused
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                {counter.status}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {counter.queue.length} in line
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenQrModal(counter)}
            title="Counter QR Display"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(counter.id)}
            title={isPaused ? 'Resume Counter' : 'Pause Counter'}
            className={`p-2 rounded-xl transition-colors ${
              isPaused
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onOpenResetModal(counter)}
            title="Reset Queue"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-500 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Now Serving Card */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
            Now Serving
          </span>
          {nowServing ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {nowServing.token}
                </span>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
                  {nowServing.name} ({nowServing.party} {nowServing.party === 1 ? 'guest' : 'guests'})
                </p>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Called {nowServing.calledAt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSkipToken(counter.id)}
                  title="Skip Guest (No-show)"
                  className="p-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-500 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onCompleteToken(counter.id)}
                  title="Complete Service"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              Counter idle — Click Call Next to serve next guest.
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onCallNext(counter.id)}
          disabled={isPaused || counter.queue.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all shadow-xs ${
            isPaused || counter.queue.length === 0
              ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black hover:scale-[1.01]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Call Next Guest ({counter.queue[0]?.ticket || 'Empty'})</span>
        </button>

        {/* Queue Preview List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            <span>Next in Queue</span>
            <span>{counter.queue.length} waiting</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {counter.queue.length === 0 ? (
              <p className="text-center py-3 text-xs text-zinc-400 dark:text-zinc-500 italic">
                No tickets waiting in line
              </p>
            ) : (
              counter.queue.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">{item.ticket}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">({item.name})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-zinc-400">{item.wait}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        idx === 0
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {idx === 0 ? 'Next' : `#${idx + 1}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skipped List (if any) */}
        {counter.skippedList && counter.skippedList.length > 0 && (
          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-500 mb-2">
              <span>Skipped Tickets ({counter.skippedList.length})</span>
              <button
                type="button"
                onClick={() => onClearSkipped(counter.id)}
                className="text-[10px] text-zinc-400 hover:text-rose-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {counter.skippedList.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onRequeueSkipped(counter.id, s)}
                  title="Click to re-queue"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-colors"
                >
                  <span>{s.token}</span>
                  <RotateCcw className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterCard;
