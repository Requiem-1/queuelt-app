import { Download } from 'lucide-react';
import useAnalyticsData from '../hooks/useAnalyticsData';
import AnalyticsKPIBar from '../components/analytics/AnalyticsKPIBar';
import ThroughputChart from '../components/analytics/ThroughputChart';
import CounterDistributionChart from '../components/analytics/CounterDistributionChart';
import RecentServedTable from '../components/analytics/RecentServedTable';

export const AnalyticsPage = () => {
  const {
    timeRange,
    setTimeRange,
    hourlyData,
    counterStats,
    recentServed,
    kpiMetrics,
    handleExportCSV,
  } = useAnalyticsData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Operations Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
            Queue Analytics & Performance
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
            {['today', 'week', 'month'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <AnalyticsKPIBar metrics={kpiMetrics} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ThroughputChart hourlyData={hourlyData} />
        <CounterDistributionChart counterStats={counterStats} />
      </div>

      {/* Historical Logs Table */}
      <RecentServedTable recentServed={recentServed} />
    </div>
  );
};

export default AnalyticsPage;
