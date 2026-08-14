import { Plus, Edit3, Trash2, Power, Clock } from 'lucide-react';

export const VenuesTab = ({
  venues,
  onOpenAddModal,
  onEditVenue,
  onDeleteVenue,
  onToggleStatus,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Venue Infrastructure</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage global physical locations, counter allotments, and operating hours
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => {
          const isActive = venue.status === 'Active';
          return (
            <div
              key={venue.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs'
                  : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {venue.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                    {venue.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-2">
                  {venue.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{venue.category}</p>

                <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-400 text-[10px] block">Counters</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {venue.countersCount || 3} Active
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] block">Capacity</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {venue.capacity || 200} guests
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-zinc-500 text-[11px] mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{venue.operatingHours || '08:00 AM - 08:00 PM'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStatus(venue.id)}
                  title={isActive ? 'Deactivate Venue' : 'Activate Venue'}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditVenue(venue)}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteVenue(venue.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VenuesTab;
