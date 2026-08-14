import { BarChart3 } from 'lucide-react';

export const ThroughputChart = ({ hourlyData }) => {
  const maxTokens = Math.max(...hourlyData.map((d) => d.tokens), 1);

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> Hourly Throughput & Peak Loads
          </h2>
          <p className="text-xs text-zinc-500">Number of tickets served per hour window</p>
        </div>
      </div>

      <div className="pt-4 flex items-end justify-between gap-2 h-48 sm:h-56">
        {hourlyData.map((item, idx) => {
          const heightPercent = Math.round((item.tokens / maxTokens) * 100);
          const isPeak = item.tokens >= 80;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.tokens}
              </span>
              <div
                className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                  isPeak
                    ? 'bg-purple-500 group-hover:bg-purple-400'
                    : 'bg-zinc-900 dark:bg-zinc-700 group-hover:bg-zinc-700 dark:group-hover:bg-zinc-500'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[10px] font-semibold text-zinc-500 truncate">{item.hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThroughputChart;
