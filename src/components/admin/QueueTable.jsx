import { useState, useMemo } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

export const QueueTable = ({ counters, onCallNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounterFilter, setSelectedCounterFilter] = useState('ALL');

  // Flatten active queue items across all counters
  const allQueueItems = useMemo(() => {
    const list = [];
    counters.forEach((c) => {
      if (c.nowServing) {
        list.push({
          ...c.nowServing,
          counterId: c.id,
          counterName: c.name,
          counterCode: c.code,
          queueStatus: 'Now Serving',
        });
      }
      c.queue.forEach((q, idx) => {
        list.push({
          id: q.id,
          token: q.ticket,
          name: q.name,
          party: q.party,
          wait: q.wait,
          counterId: c.id,
          counterName: c.name,
          counterCode: c.code,
          queueStatus: idx === 0 ? 'Next In Line' : 'Waiting',
        });
      });
    });
    return list;
  }, [counters]);

  const filteredItems = useMemo(() => {
    return allQueueItems.filter((item) => {
      const matchesSearch =
        item.token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCounter =
        selectedCounterFilter === 'ALL' || item.counterCode === selectedCounterFilter;
      return matchesSearch && matchesCounter;
    });
  }, [allQueueItems, searchQuery, selectedCounterFilter]);

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Queue Registry</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time breakdown of all guest tickets across venue lines
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search token / name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          {/* Filter Counter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedCounterFilter}
              onChange={(e) => setSelectedCounterFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
            >
              <option value="ALL">All Counters</option>
              {counters.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
              <th className="py-2.5 px-3">Token</th>
              <th className="py-2.5 px-3">Guest Name</th>
              <th className="py-2.5 px-3">Counter</th>
              <th className="py-2.5 px-3">Party</th>
              <th className="py-2.5 px-3">Est. Wait</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400 dark:text-zinc-500 italic">
                  No matching tickets in queue
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-black text-zinc-900 dark:text-white">
                    {item.token}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-700 dark:text-zinc-300">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[10px]">
                      {item.counterCode} • {item.counterName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">
                    {item.party} {item.party === 1 ? 'person' : 'people'}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400 font-medium">
                    {item.wait || '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.queueStatus === 'Now Serving'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : item.queueStatus === 'Next In Line'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {item.queueStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {item.queueStatus !== 'Now Serving' && (
                      <button
                        type="button"
                        onClick={() => onCallNext(item.counterId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-[10px] hover:opacity-90 transition-opacity"
                      >
                        <Sparkles className="w-3 h-3" /> Call
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueTable;
