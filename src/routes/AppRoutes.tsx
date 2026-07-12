import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { EventsPage } from '../pages/EventsPage';
import { BoardMembersPage } from '../pages/BoardMembersPage';
import { AnnouncementsPage } from '../pages/Announcements/AnnouncementsPage';
import { CollaborationsPage } from '../pages/Collaborations/CollaborationsPage';
import { UsersPage } from '../pages/Users/UsersPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { MessagesPage } from '../pages/Messages/MessagesPage';
import { EmailPage } from '../pages/Email/EmailPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { NotificationsPage } from '../pages/Notifications/NotificationsPage';
import { LoginPage } from '../pages/LoginPage';
export function AppRoutes() {
  const { isAuthenticated, isInitializing } = useApp();
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"
          role="status"
          aria-label="Loading" />
        
      </div>);

  }
  return (
    <Routes>
      {!isAuthenticated ?
      <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </> :

      <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route
          path="/services"
          element={<Navigate to="/announcements" replace />} />
        
          <Route path="/events" element={<EventsPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          <Route path="/board-members" element={<BoardMembersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      }
    </Routes>);

}