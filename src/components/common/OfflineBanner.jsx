import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [reconnectedMessage, setReconnectedMessage] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setReconnectedMessage(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setReconnectedMessage(true);
      setTimeout(() => setReconnectedMessage(false), 3500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="sticky top-0 z-50 w-full bg-amber-500 text-zinc-950 px-4 py-2.5 shadow-md border-b border-amber-600 animate-in fade-in duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-center">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-zinc-950" />
          <span>⚡ You are currently offline. Queue updates paused.</span>
        </div>
      </div>
    );
  }

  if (reconnectedMessage) {
    return (
      <div className="sticky top-0 z-50 w-full bg-emerald-600 text-white px-4 py-2.5 shadow-md border-b border-emerald-700 animate-in fade-in duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-center">
          <Wifi className="w-4 h-4 shrink-0 text-white" />
          <span>🌐 Internet restored! Live queue updates re-synchronized.</span>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineBanner;
