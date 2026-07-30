import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, QrCode, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const QueueQRCode = ({
  venueSlug,
  counterId,
  url,
  customUrl,
  venueName = 'Venue Queue',
  counterName = 'Counter Service',
  size = 200,
}) => {
  const canvasRef = useRef(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  let targetUrl = url || customUrl;
  if (!targetUrl) {
    if (venueSlug && counterId) {
      targetUrl = `${baseUrl}/venues/${venueSlug}?counter=${counterId}`;
    } else if (venueSlug) {
      targetUrl = `${baseUrl}/venues/${venueSlug}`;
    } else if (counterId) {
      targetUrl = `${baseUrl}/queue/${counterId}/join`;
    } else {
      targetUrl = `${baseUrl}/venues/v1`;
    }
  }

  const fileId = venueSlug || counterId || 'qr';

  const handleDownload = () => {
    try {
      const container = canvasRef.current;
      if (!container) return;
      const canvas = container.querySelector('canvas');
      if (!canvas) return;

      const image = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `queueit-qr-${fileId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast.success('QR Code downloaded as PNG!');
    } catch (err) {
      console.error('[QueueQRCode]: Download failed:', err);
      toast.error('Failed to download QR code PNG');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-5 bg-zinc-950 rounded-3xl border border-zinc-800">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
          {venueName}
        </span>
        <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
          <QrCode className="w-5 h-5 text-blue-400" /> {counterName}
        </h3>
        <p className="text-xs text-zinc-400">Scan with mobile camera to access live virtual queue</p>
      </div>

      {/* Styled Canvas Wrapper */}
      <div
        ref={canvasRef}
        className="p-4 bg-white rounded-2xl border-4 border-zinc-800 shadow-xl inline-block"
      >
        <QRCodeCanvas
          value={targetUrl}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
          marginSize={1}
        />
        <div className="mt-2 pt-2 border-t border-zinc-200 text-center">
          <p className="text-[10px] font-mono font-bold text-black tracking-wider truncate max-w-[220px] mx-auto">
            {targetUrl}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full pt-1">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleDownload}
          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handlePrint}
          className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QueueQRCode;
