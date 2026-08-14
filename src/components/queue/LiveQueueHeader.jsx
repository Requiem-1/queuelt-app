import { Volume2, VolumeX, RefreshCw, Radio } from 'lucide-react';

export const LiveQueueHeader = ({
  venueName,
  counterName,
  counterCode,
  audioEnabled,
  onToggleAudio,
  onRefresh,
  lastSyncedTime,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            Live Queue Tracker
          </span>
          <span className="text-xs text-zinc-400">•</span>
          <span className="text-xs text-zinc-500 font-medium">{venueName}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          {counterName}
          {counterCode && (
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Counter {counterCode}
            </span>
          )}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleAudio}
          title={audioEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
          className={`p-2.5 rounded-xl border transition-colors ${
            audioEnabled
              ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white'
              : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-400'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onRefresh}
          title="Manual Queue Refresh"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync ({lastSyncedTime || 'Now'})</span>
        </button>
      </div>
    </div>
  );
};

export default LiveQueueHeader;
