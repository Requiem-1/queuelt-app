import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  X,
  Building2,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({
  mobileOpen = false,
  setMobileOpen = () => {},
  isCollapsed: controlledIsCollapsed,
  setIsCollapsed: controlledSetIsCollapsed
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const { user } = useAuth();

  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = controlledSetIsCollapsed || setInternalIsCollapsed;

  const isSuperAdmin = user && user.role === 'superadmin';

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Active Queues', href: '/admin/queues', icon: ListOrdered },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Venue Settings', href: '/admin/settings', icon: Settings },
    ...(isSuperAdmin
      ? [
          { name: 'Venues & Staff', href: '/admin/super', icon: Building2 },
        ]
      : []),
  ];

  const sidebarContent = (
    <aside
      className={`h-screen sticky top-0 flex flex-col justify-between border-r border-white/10 bg-zinc-950 z-40 shrink-0 overflow-x-hidden transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Top Section: Logo + Admin Navigation links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col min-h-0 w-full max-w-full">
        {/* Header */}
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center p-3 min-h-[56px] border-b border-white/10 shrink-0">
            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="hidden sm:flex p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors items-center justify-center mx-auto cursor-pointer"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="sm:hidden p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center justify-center mx-auto cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between p-3 min-h-[56px] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 shrink-0">
              <BrandLogo to="/admin" isDarkBackground={true} showText={true} imgClassName="h-6" textSize="text-base font-bold" />
            </div>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden sm:flex p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="sm:hidden p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Nav Links */}
        <div className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
          {!isCollapsed && (
            <div className="mb-1">
              <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase block overflow-hidden whitespace-nowrap">
                Admin Menu
              </span>
            </div>
          )}

          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold border border-white/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? link.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs truncate min-w-0 transition-all duration-300">
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title={isCollapsed ? 'Back to Public App' : undefined}
            >
              <ArrowLeft className="w-4 h-4 shrink-0 text-zinc-400" />
              {!isCollapsed && (
                <span className="text-xs truncate min-w-0 transition-all duration-300">
                  Public View
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom Section: GU / User Profile Badge */}
      <div className="p-2.5 border-t border-white/10 shrink-0 mt-auto bg-zinc-950 w-full max-w-full overflow-x-hidden">
        {isCollapsed ? (
          <div className="flex items-center justify-center w-full py-1 bg-transparent border-none">
            <div className="relative w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-zinc-100 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'GU'}
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950"></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/60 border border-white/5 min-w-0 w-full max-w-full overflow-x-hidden">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-100 font-bold flex items-center justify-center text-xs border border-zinc-700 shadow-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'GU'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950"></span>
            </div>

            <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-all duration-300">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-zinc-100 truncate">
                  {user?.name || 'Guest User'}
                </p>
                <span className="text-[9px] px-1.5 py-0.5 shrink-0 inline-flex items-center gap-1 rounded font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                  <ShieldCheck className="w-2.5 h-2.5 text-zinc-400" />
                  {user?.role || 'Admin'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'admin@queueit.app'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="hidden sm:block shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-zinc-950 h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
