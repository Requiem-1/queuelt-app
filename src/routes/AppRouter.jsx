import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { ProtectedRoute, AdminRoute, SuperAdminRoute } from '../components/auth/ProtectedRoute';
import PageTransition from '../components/PageTransition';

const HomePage = lazy(() => import('../pages/HomePage'));
const QueueJoinPage = lazy(() => import('../pages/QueueJoinPage'));
const LiveQueueStatus = lazy(() => import('../pages/LiveQueueStatus'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const SuperAdminPage = lazy(() => import('../pages/SuperAdminPage'));
const VenueSettingsPage = lazy(() => import('../pages/VenueSettingsPage'));
const ActiveQueuesPage = lazy(() => import('../pages/ActiveQueuesPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="queue/:id/join" element={<PageTransition><QueueJoinPage /></PageTransition>} />
            <Route
              path="queue/:id/status"
              element={
                <ProtectedRoute>
                  <PageTransition><LiveQueueStatus /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="queue/status" element={<ProtectedRoute><PageTransition><LiveQueueStatus /></PageTransition></ProtectedRoute>} />
            <Route path="my-queue" element={<ProtectedRoute><PageTransition><LiveQueueStatus /></PageTransition></ProtectedRoute>} />
            <Route path="my-tickets" element={<ProtectedRoute><PageTransition><LiveQueueStatus /></PageTransition></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><PageTransition><LiveQueueStatus /></PageTransition></ProtectedRoute>} />
            <Route path="login" element={<PageTransition><LoginPage /></PageTransition>} />

            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <PageTransition><AdminDashboard /></PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="admin/queues"
              element={
                <AdminRoute>
                  <PageTransition><ActiveQueuesPage /></PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="admin/analytics"
              element={
                <AdminRoute>
                  <PageTransition><AnalyticsPage /></PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="admin/settings"
              element={
                <AdminRoute>
                  <PageTransition><VenueSettingsPage /></PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="admin/super"
              element={
                <SuperAdminRoute>
                  <PageTransition><SuperAdminPage /></PageTransition>
                </SuperAdminRoute>
              }
            />
            <Route
              path="superadmin"
              element={
                <SuperAdminRoute>
                  <PageTransition><SuperAdminPage /></PageTransition>
                </SuperAdminRoute>
              }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRouter;
