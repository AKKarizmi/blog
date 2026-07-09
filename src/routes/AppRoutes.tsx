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
import { UsersPage } from '../pages/admin/UsersPage';
import { BoardMembersPage } from '../pages/admin/BoardMembersPage';
import { CollaborationsPage } from '../pages/admin/CollaborationsPage';
import { EmailPage } from '../pages/admin/EmailPage';
import { NotificationsPage } from '../pages/admin/NotificationsPage';
import { ProfilePage } from '../pages/admin/ProfilePage';

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

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProfilePage />
            </AdminLayout>
          </ProtectedRoute>
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
                <Route path="users" element={<UsersPage />} />
                <Route path="board-members" element={<BoardMembersPage />} />
                <Route path="collaborations" element={<CollaborationsPage />} />
                <Route path="email" element={<EmailPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
