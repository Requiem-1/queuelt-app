import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Compass, Ticket, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('queueit_token');
      sessionStorage.removeItem('queueit_user');
      sessionStorage.removeItem('queueit_active_ticket');
      localStorage.removeItem('queueit_token');
      localStorage.removeItem('queueit_user');
      localStorage.removeItem('queueit_active_ticket');
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Browse Venues', href: '/', matchPaths: ['/', '/venues'], icon: Compass },
    { name: 'My Queue', href: '/my-queue', matchPaths: ['/queue/c1/status', '/queue/v1/status', '/my-queue', '/queue/status'], icon: Ticket },
    { name: 'Admin Dashboard', href: '/admin', matchPaths: ['/admin', '/admin/queues', '/admin/analytics', '/admin/settings'], icon: LayoutDashboard },
  ];

  const getInitials = (name) => {
    if (!name) return 'GU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <BrandLogo />
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm transition-colors duration-150 ${
                    isActive || (link.matchPaths && link.matchPaths.includes(location.pathname))
                      ? 'text-zinc-900 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle className="rounded-full border-zinc-200 dark:border-zinc-800" />
          {user ? (
            /* User Profile Avatar Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-extrabold text-xs flex items-center justify-center border border-zinc-300 dark:border-zinc-700 shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-left whitespace-nowrap">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase">
                    {user.role}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50 space-y-3">
                  {/* User Info Header */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-extrabold text-xs flex items-center justify-center shrink-0 border border-zinc-300 dark:border-zinc-700">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user.email || `ID: ${user.id}`}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                        Role: {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="space-y-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <Link
                      to="/my-queue"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-zinc-400" />
                      <span>Active Queue Status</span>
                    </Link>
                    <Link
                      to="/my-queue"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>My Profile &amp; Tickets</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout / Reset Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out / Anonymous State Button */
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white dark:text-black bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Guest</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle className="rounded-full border-zinc-200 dark:border-zinc-800" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {user && (
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 text-white font-extrabold text-xs flex items-center justify-center">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                  <p className="text-[10px] text-zinc-400 font-extrabold uppercase">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive || (link.matchPaths && link.matchPaths.includes(location.pathname))
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-950/60 text-emerald-400 rounded-full border border-emerald-800/50">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          {!user && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-black bg-white hover:bg-zinc-200 rounded-xl shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Guest</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
