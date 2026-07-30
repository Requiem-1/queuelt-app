import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/common/BrandLogo';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'guest'
  const [email, setEmail] = useState('admin@queueit.app');
  const [password, setPassword] = useState('admin123');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { user, login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.from || '/';

  const redirectByRole = (userObj) => {
    if (userObj?.role === 'admin' || userObj?.role === 'superadmin') {
      navigate('/admin', { replace: true });
    } else {
      navigate(from === '/login' ? '/' : from, { replace: true });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const loggedUser = await login(email, password);
      toast.success('Welcome back!');
      redirectByRole(loggedUser);
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const guestUser = await guestLogin(nickname);
      toast.success('Welcome back!');
      redirectByRole(guestUser);
    } catch (err) {
      const msg = err.message || 'Guest login failed.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (role === 'admin') {
        const loggedUser = await login('admin@queueit.app', 'admin123');
        toast.success('Welcome back!');
        redirectByRole(loggedUser);
      } else if (role === 'superadmin') {
        const loggedUser = await login('superadmin@queueit.app', 'superadmin123');
        toast.success('Welcome back!');
        redirectByRole(loggedUser);
      } else {
        const guestUser = await guestLogin('Quick Guest');
        toast.success('Welcome back!');
        redirectByRole(guestUser);
      }
    } catch (err) {
      const msg = err.message || 'Quick login failed.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrandLogo showBadge={false} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome to QueueIt
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account or continue as a guest.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'guest'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Guest Session
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Email Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@queueit.app"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-sm shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Guest Access Form */
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Nickname (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-sm shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Joining...' : 'Join as Guest'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Developer / Seed Accounts Quick Login */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-zinc-400" /> Quick Seed Login
            </span>
            {user && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                Role: {user.role}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Admin', role: 'admin' },
              { label: 'SuperAdmin', role: 'superadmin' },
              { label: 'Guest', role: 'guest' },
            ].map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleQuickLogin(item.role)}
                disabled={isSubmitting}
                className="py-2 px-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer text-center disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
