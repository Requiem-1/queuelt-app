import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, MapPin, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { mockVenues, CATEGORIES } from '../data/mockVenues';
import CardSkeleton from '../components/common/CardSkeleton';
import api from '../services/api';

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [venuesList, setVenuesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveVenues = async () => {
      setIsLoading(true);
      try {
        const data = await api.get('/venues');
        if (data && data.venues && data.venues.length > 0) {
          const mapped = data.venues.map((v) => ({
            id: v.slug || v._id,
            mongoId: v._id,
            slug: v.slug,
            name: v.name,
            category: v.category || 'General',
            status: v.status || 'Active',
            currentQueueCount: v.activeQueueCount ?? v.currentQueueLength ?? 0,
            queueLength: v.activeQueueCount ?? v.currentQueueLength ?? 0,
            estimatedWaitMinutes: v.estimatedAvgWaitTime ?? v.averageWaitTimeMinutes ?? 0,
            estWait: v.estWait || `${v.estimatedAvgWaitTime ?? v.averageWaitTimeMinutes ?? 10} mins`,
            location: v.location?.address || v.address || 'Local Venue',
            image: v.image || v.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
            counters: v.counters || [],
          }));
          setVenuesList(mapped);
        } else {
          setVenuesList(mockVenues);
        }
      } catch (err) {
        console.warn('Backend API unavailable, using fallback mock venues:', err);
        setVenuesList(mockVenues);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveVenues();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  const filteredVenues = venuesList.filter((venue) => {
    const matchesCategory = selectedCategory === 'All' || venue.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'open') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-600 text-white border border-emerald-500 shadow-xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {status}
        </span>
      );
    }
    if (s === 'paused' || s === 'busy') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-600 text-white border border-amber-500 shadow-xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {status}
        </span>
      );
    }
    if (s === 'closed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-600 text-white border border-rose-500 shadow-xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-600 text-white border border-emerald-500 shadow-xs shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Header - Floating Clean Canvas Layout */}
      <div className="pt-4 pb-6 space-y-8 flex flex-col items-center text-center w-full">
        <div className="max-w-5xl w-full mx-auto space-y-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-1">
            <Sparkles className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span>Skip the line, save your time</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-white text-center leading-tight sm:leading-[1.15]">
            Browse Venues <br /> &amp; Categories
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl text-center px-4 mt-2">
            Join real-time virtual queues at your favorite places and get live ETA updates directly on your device.
          </p>

          {/* Search Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-3xl w-full justify-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by venue name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800/80 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-zinc-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pt-4 pb-2 scrollbar-none w-full max-w-7xl mx-auto">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" /> Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <motion.button
              whileTap={{ scale: 0.97 }}
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border border-zinc-900 dark:border-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Venues Feed Section */}
      <section className="space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              Featured Venues
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Showing {filteredVenues.length} active queue {filteredVenues.length === 1 ? 'location' : 'locations'}
            </p>
          </div>

          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Syncing
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
            <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No venues match your search</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try searching with a different term or reset your category filter to explore all available venues.
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Show All Venues
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 shadow-xs hover:shadow-md transition-colors duration-200 flex flex-col justify-between cursor-pointer"
                onClick={() => navigate(`/queue/${venue.id}/join`)}
              >
                {/* Image Container - Fixed 16/9 aspect ratio, rounded-t-lg, NO absolute badges */}
                <div className="w-full aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col gap-3 justify-between">
                  <div className="space-y-1.5">
                    {/* Top Row: Title + Integrated Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {venue.name}
                      </h3>
                      {renderStatusBadge(venue.status)}
                    </div>

                    {/* Subtitle / Category & Location */}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-normal">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span>{venue.category} • {venue.location}</span>
                    </p>
                  </div>

                  {/* Clean Metric Row */}
                  <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 py-2 border-y border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Est. Wait: <strong className="font-medium text-zinc-900 dark:text-zinc-200 tabular-nums">{venue.estWait}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>In Line: <strong className="font-medium text-zinc-900 dark:text-zinc-200 tabular-nums">{venue.queueLength} guests</strong></span>
                    </div>
                  </div>

                  {/* Available Counters List */}
                  {venue.counters && venue.counters.length > 0 && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal truncate">
                      Counters: <span className="text-zinc-700 dark:text-zinc-300 font-medium">{venue.counters.join(', ')}</span>
                    </p>
                  )}

                  {/* Dual Action Buttons Row */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/queue/${venue.id}/join`);
                      }}
                      className="w-full py-2.5 px-3 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs tracking-wide rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Join Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/queue/${venue.id}/join`);
                      }}
                      className="w-full py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-xs tracking-wide rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-zinc-200 dark:border-zinc-700"
                    >
                      <span>Status</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
