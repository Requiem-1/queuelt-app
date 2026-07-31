import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Layers,
  ChevronRight
} from 'lucide-react';
import { mockVenues } from '../data/mockVenues';
import { JoinQueueModal } from '../components/queue/JoinQueueModal';

export const QueueJoinPage = () => {
  const { id } = useParams();

  // Find target venue or fallback to first mock venue
  const venue = mockVenues.find((v) => v.id === id) || mockVenues[0];

  // Drawer / Modal state for selected counter
  const [selectedCounter, setSelectedCounter] = useState(null);

  // Counter list definition for venue
  const getVenueCounters = () => {
    if (venue.id === 'v1') {
      return [
        { id: 'c1', name: 'Veg Counter', status: 'Active', nowServing: '#V-24', inLine: 4, waitPerPerson: '3 mins' },
        { id: 'c2', name: 'Non-Veg Counter', status: 'Busy', nowServing: '#NV-41', inLine: 8, waitPerPerson: '4 mins' },
        { id: 'c3', name: 'Bar & Beverages', status: 'Fast Line', nowServing: '#B-09', inLine: 1, waitPerPerson: '2 mins' },
        { id: 'c4', name: 'Desserts & Bakery', status: 'Active', nowServing: '#D-15', inLine: 3, waitPerPerson: '3 mins' },
      ];
    }
    if (venue.id === 'v2') {
      return [
        { id: 'c1', name: 'General OPD', status: 'Busy', nowServing: '#OPD-102', inLine: 9, waitPerPerson: '5 mins' },
        { id: 'c2', name: 'Pediatrics Desk', status: 'Active', nowServing: '#PED-44', inLine: 3, waitPerPerson: '4 mins' },
        { id: 'c3', name: 'Pharmacy Collection', status: 'Fast Line', nowServing: '#RX-88', inLine: 2, waitPerPerson: '2 mins' },
      ];
    }
    if (venue.id === 'v3') {
      return [
        { id: 'c1', name: 'Personal Trainer Desk', status: 'Active', nowServing: '#PT-05', inLine: 2, waitPerPerson: '3 mins' },
        { id: 'c2', name: 'Locker Assignment', status: 'Fast Line', nowServing: '#LK-31', inLine: 1, waitPerPerson: '1 min' },
      ];
    }
    if (venue.id === 'v4') {
      return [
        { id: 'c1', name: 'Book Checkout Counter', status: 'Active', nowServing: '#LIB-50', inLine: 3, waitPerPerson: '2 mins' },
        { id: 'c2', name: 'Digital Archival Lab', status: 'Active', nowServing: '#DIG-12', inLine: 1, waitPerPerson: '3 mins' },
      ];
    }
    if (venue.id === 'v5') {
      return [
        { id: 'c1', name: 'Teller Counter 1', status: 'Busy', nowServing: '#T1-89', inLine: 6, waitPerPerson: '4 mins' },
        { id: 'c2', name: 'Account Opening Desk', status: 'Active', nowServing: '#ACC-14', inLine: 3, waitPerPerson: '6 mins' },
        { id: 'c3', name: 'Mortgage Advisory', status: 'Active', nowServing: '#MTG-03', inLine: 1, waitPerPerson: '10 mins' },
      ];
    }
    return [
      { id: 'c1', name: 'Main Entry Counter', status: 'Active', nowServing: '#A-35', inLine: 5, waitPerPerson: '3 mins' },
      { id: 'c2', name: 'Express Desk', status: 'Fast Line', nowServing: '#E-12', inLine: 2, waitPerPerson: '2 mins' },
    ];
  };

  const counters = getVenueCounters();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-blue-500" />
        Back to All Venues
      </Link>

      {/* 1. Venue Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="relative h-48 sm:h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-900/90 backdrop-blur-md text-white text-xs font-bold border border-zinc-800">
                  {venue.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-500 text-xs font-bold shadow-xs">
                  {venue.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md text-white">
                {venue.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {venue.location}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Avg Wait</p>
                  <p className="text-sm font-black text-white">{venue.estWait}</p>
                </div>
              </div>
              <div className="w-px h-7 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">In Queue</p>
                  <p className="text-sm font-black text-white">{venue.queueLength} guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Counters / Queues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-400" /> Select an Active Counter Queue
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Choose your preferred counter to join its virtual waiting line.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 p-5 shadow-xs hover:shadow-md hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {counter.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold border border-emerald-500 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {counter.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">Now Serving</p>
                  <span className="font-mono font-bold tracking-tight px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/60 rounded-lg text-sm shadow-inner inline-block tabular-nums">
                    {counter.nowServing}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-100 dark:border-zinc-800/80 text-xs">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-normal">People Ahead</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{counter.inLine} guests</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-normal">Est. Wait Time</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">~{counter.inLine * 3} Mins ({counter.waitPerPerson}/person)</p>
                </div>
              </div>

              {/* Join Button */}
              <button
                type="button"
                onClick={() => setSelectedCounter(counter)}
                className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-xs transition-all rounded-xl px-4 py-2.5 w-full flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Join Queue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Join Queue Modal */}
      <JoinQueueModal
        isOpen={Boolean(selectedCounter)}
        onClose={() => setSelectedCounter(null)}
        venueData={venue}
        counterData={selectedCounter}
      />
    </div>
  );
};

export default QueueJoinPage;
