import { useState } from 'react';
import { UserPlus, QrCode, Pause, Play, AlertCircle } from 'lucide-react';
import useAdminCounters, { INITIAL_VENUES } from '../hooks/useAdminCounters';
import AdminStatsBar from '../components/admin/AdminStatsBar';
import VenueDropdown from '../components/admin/VenueDropdown';
import CounterCardGrid from '../components/admin/CounterCardGrid';
import QueueTable from '../components/admin/QueueTable';
import AddWalkInModal from '../components/admin/AddWalkInModal';
import QRScannerModal from '../components/admin/QRScannerModal';
import QueueQRCode from '../components/QueueQRCode';

export const AdminDashboard = () => {
  const [selectedVenue, setSelectedVenue] = useState(INITIAL_VENUES[0]);

  // Modals state
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);
  const [qrModalCounter, setQrModalCounter] = useState(null);
  const [resetModalCounter, setResetModalCounter] = useState(null);

  // Custom Domain Hook
  const {
    activeCounters,
    totalWaiting,
    servedTodayCount,
    noShowsCount,
    allPaused,
    handleTogglePauseAll,
    handleCounterStatusToggle,
    handleCallNext,
    handleSkipToken,
    handleCompleteToken,
    handleRequeueSkipped,
    handleClearSkipped,
    handleResetQueue,
    handleAddWalkIn,
  } = useAdminCounters(selectedVenue);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations Room
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">Synced via Socket.io</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
            Staff Control Dashboard
          </h1>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <VenueDropdown
            selectedVenue={selectedVenue}
            onSelectVenue={setSelectedVenue}
          />

          <button
            type="button"
            onClick={() => setIsWalkInOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Walk-in</span>
          </button>

          <button
            type="button"
            onClick={() => setIsQrScanOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            onClick={handleTogglePauseAll}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-xs ${
              allPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            {allPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{allPaused ? 'Resume All' : 'Pause All'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <AdminStatsBar
        totalWaiting={totalWaiting}
        servedTodayCount={servedTodayCount}
        noShowsCount={noShowsCount}
      />

      {/* Multi-Counter Cards Grid */}
      <CounterCardGrid
        counters={activeCounters}
        onCallNext={handleCallNext}
        onSkipToken={handleSkipToken}
        onCompleteToken={handleCompleteToken}
        onToggleStatus={handleCounterStatusToggle}
        onRequeueSkipped={handleRequeueSkipped}
        onClearSkipped={handleClearSkipped}
        onOpenQrModal={setQrModalCounter}
        onOpenResetModal={setResetModalCounter}
      />

      {/* Real-time Queue Registry Table */}
      <QueueTable
        counters={activeCounters}
        onCallNext={handleCallNext}
      />

      {/* Add Walk-In Modal */}
      {isWalkInOpen && (
        <AddWalkInModal
          counters={activeCounters}
          onClose={() => setIsWalkInOpen(false)}
          onAddWalkIn={handleAddWalkIn}
        />
      )}

      {/* QR Ticket Scanner Modal */}
      {isQrScanOpen && (
        <QRScannerModal
          isOpen={isQrScanOpen}
          onClose={() => setIsQrScanOpen(false)}
          onScanSuccess={(token) => {
            console.log('Scanned ticket:', token);
          }}
        />
      )}

      {/* Counter QR Display Modal */}
      {qrModalCounter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {qrModalCounter.name} QR Code
            </h3>
            <QueueQRCode
              counterName={qrModalCounter.name}
              counterCode={qrModalCounter.code}
              joinUrl={`${window.location.origin}/venues/${selectedVenue.id}/join?counter=${qrModalCounter.id}`}
            />
            <button
              type="button"
              onClick={() => setQrModalCounter(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetModalCounter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                Reset {resetModalCounter.name}?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                This will clear all waiting and skipped tokens for this counter.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setResetModalCounter(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetQueue(resetModalCounter.id);
                  setResetModalCounter(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
