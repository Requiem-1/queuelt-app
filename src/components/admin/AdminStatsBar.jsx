import { Users, Clock, CheckCircle, UserX } from 'lucide-react';

export const AdminStatsBar = ({
  totalWaiting,
  servedTodayCount,
  noShowsCount,
  avgWaitTime = '11 min',
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Waiting</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {totalWaiting}
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Active</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Avg Wait Time</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {avgWaitTime}
          </span>
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Per counter</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Served Today</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {servedTodayCount}
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Guests</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">No-Shows / Skipped</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {noShowsCount}
          </span>
          <span className="text-[11px] font-medium text-rose-500">Missed calls</span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsBar;
