import { Activity } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import PWAInstallBanner from '../common/PWAInstallBanner';

export const Footer = () => {
  return (
    <footer className="relative z-10 w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 text-zinc-600 dark:text-zinc-400 transition-colors duration-200 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Active Queue Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  System Status: Active
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                14 Live Queues Systemwide &bull; Avg Wait: ~6m
              </p>
            </div>
          </div>

          {/* Brand Logo replacing the 4 middle links */}
          <div className="flex justify-center items-center">
            <BrandLogo to="/" showText={true} imgClassName="h-9" textSize="text-2xl" />
          </div>

          {/* PWA Install Card */}
          <div className="flex justify-center md:justify-end">
            <PWAInstallBanner />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
