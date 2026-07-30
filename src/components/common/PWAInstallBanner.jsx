import { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';
import BrandLogo from './BrandLogo';

const checkIsStandalone = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(checkIsStandalone);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install QueueIt, open your browser options menu and choose "Add to Home Screen" or "Install App".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // IF DETECTED THAT APP IS INSTALLED -> ONLY DISPLAY THE LOGO
  if (isInstalled) {
    return (
      <div className="flex items-center justify-center md:justify-end">
        <BrandLogo showText={true} imgClassName="h-8" textSize="text-xl" />
      </div>
    );
  }

  // AS LONG AS APP IS NOT INSTALLED -> DISPLAY CLEAN INSTALL ACTION IN FOOTER
  return (
    <div className="p-3 rounded-2xl bg-zinc-900/95 text-white border border-zinc-800/80 shadow-lg backdrop-blur-md flex items-center gap-3.5">
      <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
        <Smartphone className="w-4 h-4 text-blue-400" />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <h4 className="text-xs font-bold text-white whitespace-nowrap">Add QueueIt to Home Screen</h4>
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
