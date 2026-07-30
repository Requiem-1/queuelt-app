import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard that requires an active user session (guest or registered user).
 * Redirects unauthenticated visitors to /login preserving the target route.
 */
export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Route guard that requires Admin or Superadmin privileges.
 * Displays an Access Denied screen with options to return home or switch roles for dev testing.
 */
export const AdminRoute = ({ children }) => {
  const { user, isLoading, setUserRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[65vh] p-4">
        <div className="w-full max-w-md p-8 text-center space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-xs mx-auto">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
              Admin or Super Admin privileges are required to access the venue control room.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
            <button
              type="button"
              onClick={() => setUserRole('admin')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to Admin Role</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Route guard that strictly requires Superadmin privileges.
 */
export const SuperAdminRoute = ({ children }) => {
  const { user, isLoading, setUserRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperAdmin = user && user.role === 'superadmin';

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in duration-200">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-600 text-white dark:bg-purple-500 dark:text-zinc-950 border border-purple-400">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Super Admin Access Required
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Super Admin privileges are required to manage global infrastructure, staff assignments, and category taxonomy.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setUserRole('superadmin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 font-bold text-sm hover:bg-purple-500/20 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span>Switch to Superadmin Role</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
