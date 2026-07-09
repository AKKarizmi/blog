import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ApplicationsPage } from '../pages/admin/ApplicationsPage';
import { EventsPage } from '../pages/admin/EventsPage';
import { AnnouncementsPage } from '../pages/admin/AnnouncementsPage';
import { MessagesPage } from '../pages/admin/MessagesPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <SignInPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignUpPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
