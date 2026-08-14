import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { INITIAL_VENUES } from '../../hooks/useAdminCounters';

export const VenueDropdown = ({ selectedVenue, onSelectVenue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-750 border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 font-semibold text-xs transition-all shadow-xs"
      >
        <Building2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
        <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedVenue.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Switch Venue
          </div>
          {INITIAL_VENUES.map((venue) => {
            const isSelected = venue.id === selectedVenue.id;
            return (
              <button
                key={venue.id}
                type="button"
                onClick={() => {
                  onSelectVenue(venue);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{venue.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VenueDropdown;
