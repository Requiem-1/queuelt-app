import { useState } from 'react';
import { Building2, Save, Sparkles, Bell, Layers } from 'lucide-react';

export const VenueSettingsPage = () => {
  const [venueName, setVenueName] = useState('Main Cafeteria');
  const [venueCode, setVenueCode] = useState('CAF');
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 08:00 PM');
  const [maxCapacity, setMaxCapacity] = useState(250);
  const [autoNotify, setAutoNotify] = useState(true);
  const [audioChime, setAudioChime] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Venue settings updated successfully!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm shadow-2xl flex items-center gap-3 border border-zinc-700">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Venue Settings
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white border border-emerald-500 shadow-xs">
              Active Config
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Manage operational rules, counter capacity, and customer notification preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-sm shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Sections Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General & Operating Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">General Venue Info</h2>
                <p className="text-xs text-zinc-400">Public profile details displayed to queueing guests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Venue Name</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Venue Code Prefix</label>
                <input
                  type="text"
                  value={venueCode}
                  onChange={(e) => setVenueCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Max Queue Capacity</label>
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Active Counters Management Card */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Active Counters Config</h2>
                <p className="text-xs text-zinc-400">Configure counter channels and prefix codes</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Veg Counter', code: 'V', status: 'Active', wait: '3 mins/guest' },
                { name: 'Non-Veg Counter', code: 'NV', status: 'Active', wait: '4 mins/guest' },
                { name: 'Beverages & Desserts', code: 'BEV', status: 'Active', wait: '2 mins/guest' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold px-2 py-1 bg-zinc-800 text-zinc-200 rounded border border-zinc-700/60 shrink-0">
                      #{c.code}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{c.name}</p>
                      <p className="text-zinc-400 text-[11px] truncate">{c.wait}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-500 font-bold text-[10px] shadow-xs">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Audio Broadcast */}
        <div className="space-y-6">
          {/* Notification Rules Card */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Broadcast &amp; Audio</h2>
                <p className="text-xs text-zinc-400">Auditory and SMS alerts</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-white/5 cursor-pointer">
                <div>
                  <p className="font-bold text-white">SMS Notifications</p>
                  <p className="text-[11px] text-zinc-400">Send token status updates via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoNotify}
                  onChange={(e) => setAutoNotify(e.target.checked)}
                  className="w-4 h-4 accent-zinc-200 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-white/5 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Call-Next Audio Chime</p>
                  <p className="text-[11px] text-zinc-400">Play sound alert on counter dashboard</p>
                </div>
                <input
                  type="checkbox"
                  checked={audioChime}
                  onChange={(e) => setAudioChime(e.target.checked)}
                  className="w-4 h-4 accent-zinc-200 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VenueSettingsPage;
