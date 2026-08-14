import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Users, Clock, MapPin, X } from 'lucide-react';

export const TicketDetailCard = ({
  ticketNumber,
  partySize = 1,
  qrCodeToken,
  venueAddress = 'Campus Food Court, Block B',
  joinedAt = 'Just now',
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const tokenForQr = qrCodeToken || `QR-${ticketNumber || 'TKT'}`;

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Ticket Verification Details</h3>
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors"
        >
          <QrCode className="w-4 h-4 text-blue-500" />
          <span>Show Counter QR</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-zinc-400 text-[10px] block">Party Size</span>
          <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1 mt-0.5">
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-zinc-400 text-[10px] block">Joined Queue</span>
          <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {joinedAt}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50 col-span-2 sm:col-span-1">
          <span className="text-zinc-400 text-[10px] block">Venue Location</span>
          <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{venueAddress}</span>
          </span>
        </div>
      </div>

      {/* QR Display Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xs w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500">Scan at Counter</span>
              <button onClick={() => setShowQrModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 inline-block mx-auto shadow-xs">
              <QRCodeSVG value={tokenForQr} size={180} level="H" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xl font-black text-zinc-900 dark:text-white">{ticketNumber}</span>
              <p className="text-[11px] text-zinc-500">Show this digital token to staff at the counter</p>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailCard;
