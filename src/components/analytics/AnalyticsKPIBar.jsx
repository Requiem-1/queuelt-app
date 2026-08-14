import { Users, Clock, Zap, ThumbsUp } from 'lucide-react';

export const AnalyticsKPIBar = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Total Throughput</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {metrics.totalServed}
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">+18% vs avg</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Average Wait</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {metrics.avgWaitMinutes}m
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">-2.4m faster</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Peak Hour Window</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate">
            {metrics.peakHour}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Satisfaction Score</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {metrics.satisfactionRate}
          </span>
          <span className="text-[11px] font-medium text-zinc-500">4.9 / 5.0</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsKPIBar;
