import { CheckCircle2 } from 'lucide-react';

export const RecentServedTable = ({ recentServed }) => {
  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-4">
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed Queue Tickets
        </h2>
        <p className="text-xs text-zinc-500">Historical log of tickets served with wait durations</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
              <th className="py-2.5 px-3">Token</th>
              <th className="py-2.5 px-3">Guest Name</th>
              <th className="py-2.5 px-3">Counter</th>
              <th className="py-2.5 px-3">Joined</th>
              <th className="py-2.5 px-3">Served</th>
              <th className="py-2.5 px-3">Wait Duration</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {recentServed.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="py-2.5 px-3 font-black text-zinc-900 dark:text-white">{item.token}</td>
                <td className="py-2.5 px-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.guest} ({item.party} {item.party === 1 ? 'pax' : 'pax'})
                </td>
                <td className="py-2.5 px-3 text-zinc-500">{item.counter}</td>
                <td className="py-2.5 px-3 text-zinc-400">{item.joined}</td>
                <td className="py-2.5 px-3 text-zinc-400">{item.served}</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{item.waitTime}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentServedTable;
