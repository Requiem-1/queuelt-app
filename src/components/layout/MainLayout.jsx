import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import BrandLogo from '../common/BrandLogo';
import OfflineBanner from '../common/OfflineBanner';
import AmbientBackground from '../common/AmbientBackground';

export const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [mobileAdminSidebarOpen, setMobileAdminSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isAdminRoute) {
    return (
      <div className="relative flex h-screen overflow-hidden w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <AmbientBackground />
        <OfflineBanner />
        <Sidebar
          mobileOpen={mobileAdminSidebarOpen}
          setMobileOpen={setMobileAdminSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <div className="relative z-10 flex-1 flex flex-col min-w-0 w-full overflow-y-auto overflow-x-hidden transition-all duration-300">
          {/* Mobile Top Header for Admin */}
          <div className="sm:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileAdminSidebarOpen(true)}
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Open Admin Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <BrandLogo to="/admin" showBadge={false} />
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-800/50">
              Admin
            </span>
          </div>

          <main className="flex-1 min-w-0 p-6 w-full max-w-[1700px] mx-auto">
            <div className="w-full flex-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-x-hidden">
      <AmbientBackground />
      <OfflineBanner />
      <Navbar />
      <main className="relative z-10 flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-6 pb-6 sm:pb-8">
        <div className="w-full flex-1">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
