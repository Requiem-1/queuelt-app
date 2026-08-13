import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import socket from '../services/socket';

const MOCK_QUEUES = [
  {
    id: 'c1',
    name: 'Veg Counter',
    code: 'V',
    status: 'Active',
    nowServing: { token: '#V-24', name: 'Sarah', party: 2 },
    waitingCount: 4,
    estWait: '12 mins',
    nextGuests: [
      { ticket: '#V-25', name: 'Michael', party: 4, wait: '18m', status: 'Next In Line' },
      { ticket: '#V-26', name: 'Pam', party: 2, wait: '14m', status: 'Waiting' },
    ],
  },
  {
    id: 'c2',
    name: 'Non-Veg Counter',
    code: 'NV',
    status: 'Active',
    nowServing: { token: '#NV-18', name: 'Angela', party: 1 },
    waitingCount: 2,
    estWait: '8 mins',
    nextGuests: [
      { ticket: '#NV-19', name: 'Stanley', party: 2, wait: '12m', status: 'Next In Line' },
      { ticket: '#NV-20', name: 'Phyllis', party: 4, wait: '7m', status: 'Waiting' },
    ],
  },
  {
    id: 'c3',
    name: 'Beverages & Desserts',
    code: 'BEV',
    status: 'Active',
    nowServing: { token: '#B-42', name: 'Ryan', party: 1 },
    waitingCount: 3,
    estWait: '6 mins',
    nextGuests: [
      { ticket: '#B-43', name: 'Kelly', party: 3, wait: '15m', status: 'Next In Line' },
      { ticket: '#B-44', name: 'Oscar', party: 2, wait: '6m', status: 'Waiting' },
    ],
  },
];

export const ActiveQueuesPage = () => {
  const [queues, setQueues] = useState(MOCK_QUEUES);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveQueues = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await api.get('/venues/main-cafeteria');
      if (res && res.venue && res.counters) {
        const mapped = res.counters.map((c) => ({
          id: c._id,
          name: c.name,
          code: c.code,
          status: c.status === 'active' ? 'Active' : 'Paused',
          nowServing: c.currentServingToken
            ? { token: c.currentServingToken, name: 'Serving Customer', party: 1 }
            : null,
          waitingCount: c.queueList ? c.queueList.length : 0,
          estWait: `${(c.queueList ? c.queueList.length : 0) * 4} mins`,
          nextGuests: (c.queueList || []).map((t, idx) => ({
            id: t._id,
            ticket: t.ticketNumber,
            name: t.guestName || 'Guest User',
            party: t.partySize || 1,
            wait: `${t.estimatedWaitMinutes || 8}m`,
            status: idx === 0 ? 'Next In Line' : 'Waiting',
          })),
        }));
        if (mapped.length > 0) {
          setQueues(mapped);
        }
      }
    } catch (err) {
      console.warn('[ActiveQueuesPage]: Backend fetch fallback:', err.message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const syncActiveQueues = async () => {
      try {
        const res = await api.get('/venues/main-cafeteria');
        if (res && res.venue && res.counters && isSubscribed) {
          const mapped = res.counters.map((c) => ({
            id: c._id,
            name: c.name,
            code: c.code,
            status: c.status === 'active' ? 'Active' : 'Paused',
            nowServing: c.currentServingToken
              ? { token: c.currentServingToken, name: 'Serving Customer', party: 1 }
              : null,
            waitingCount: c.queueList ? c.queueList.length : 0,
            estWait: `${(c.queueList ? c.queueList.length : 0) * 4} mins`,
            nextGuests: (c.queueList || []).map((t, idx) => ({
              id: t._id,
              ticket: t.ticketNumber,
              name: t.guestName || 'Guest User',
              party: t.partySize || 1,
              wait: `${t.estimatedWaitMinutes || 8}m`,
              status: idx === 0 ? 'Next In Line' : 'Waiting',
            })),
          }));
          if (mapped.length > 0) {
            setQueues(mapped);
          }
        }
      } catch (err) {
        console.warn('[ActiveQueuesPage]: Backend fetch fallback:', err.message);
      }
    };

    syncActiveQueues();

    const handleUpdate = () => {
      syncActiveQueues();
    };

    socket.on('ticket:updated', handleUpdate);
    socket.on('ticket:created', handleUpdate);

    return () => {
      isSubscribed = false;
      socket.off('ticket:updated', handleUpdate);
      socket.off('ticket:created', handleUpdate);
    };
  }, []);

  const handleCallNext = async (q) => {
    if (!q.nextGuests || q.nextGuests.length === 0) {
      toast.error(`No waiting guests in ${q.name}`);
      return;
    }
    const [nextGuest] = q.nextGuests;

    if (nextGuest.id && nextGuest.id.length >= 12) {
      try {
        await api.patch(`/tickets/${nextGuest.id}/status`, { status: 'serving' });
        toast.success(`Calling ${nextGuest.name} (${nextGuest.ticket})`);
        fetchActiveQueues(false);
        return;
      } catch (err) {
        console.warn('[ActiveQueuesPage]: API callNext failed:', err.message);
      }
    }

    toast.success(`Calling ${nextGuest.name} (${nextGuest.ticket})`);
    setQueues((prev) =>
      prev.map((item) => {
        if (item.id !== q.id) return item;
        const remaining = item.nextGuests.slice(1);
        return {
          ...item,
          nowServing: { token: nextGuest.ticket, name: nextGuest.name, party: nextGuest.party },
          waitingCount: Math.max(0, item.waitingCount - 1),
          nextGuests: remaining,
        };
      })
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Active Counter Queues
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white border border-emerald-500 shadow-xs">
              Live Monitor
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time queue depth and current serving status across all venue counters.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchActiveQueues(true)}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all border border-zinc-700/60 flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Grid of Active Queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.map((q) => (
          <div
            key={q.id}
            className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base truncate">{q.name}</h3>
                  <p className="text-xs text-zinc-400">{q.waitingCount} guests waiting</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-1 bg-zinc-800 text-zinc-200 rounded border border-zinc-700/60 shrink-0">
                #{q.code}
              </span>
            </div>

            {/* Now Serving */}
            <div className="p-5 border-b border-white/10 bg-zinc-950 space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-zinc-400 flex items-center justify-between">
                <span>Now Serving</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white border border-emerald-500 shadow-xs">
                  {q.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xl px-3 py-1.5 bg-zinc-800 text-zinc-100 rounded-xl border border-zinc-700/60">
                  {q.nowServing?.token || 'None'}
                </span>
                <div className="text-right min-w-0">
                  <p className="text-xs font-bold text-white truncate">{q.nowServing?.name || 'Counter Idle'}</p>
                  {q.nowServing && (
                    <p className="text-[11px] text-zinc-400">Party of {q.nowServing.party}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Next in Line Preview */}
            <div className="p-5 flex-1 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Next In Line
              </p>
              <div className="space-y-2">
                {q.nextGuests && q.nextGuests.length > 0 ? (
                  q.nextGuests.map((g) => (
                    <div
                      key={g.ticket}
                      className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-zinc-200">{g.ticket}</span>
                        <span className="text-zinc-300 font-medium truncate">{g.name}</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {g.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-2">No guests currently waiting</p>
                )}
              </div>
            </div>

            {/* Footer Call Action */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/30">
              <button
                type="button"
                onClick={() => handleCallNext(q)}
                disabled={!q.nextGuests || q.nextGuests.length === 0}
                className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Call Next Customer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveQueuesPage;
