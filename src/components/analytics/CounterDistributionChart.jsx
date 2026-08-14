import { PieChart } from 'lucide-react';

export const CounterDistributionChart = ({ counterStats }) => {
  const total = counterStats.reduce((acc, c) => acc + c.served, 0);

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-500" /> Counter Efficiency & Volume
          </h2>
          <p className="text-xs text-zinc-500">Distribution of served guests by service counter</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {counterStats.map((counter, idx) => {
          const percent = Math.round((counter.served / total) * 100);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {counter.name} ({counter.code})
                </span>
                <div className="flex items-center gap-3 text-zinc-500">
                  <span>{counter.served} guests ({percent}%)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {counter.efficiency}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterDistributionChart;
