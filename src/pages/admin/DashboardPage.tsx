import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, Calendar, TrendingUp, Megaphone, MessageSquare } from 'lucide-react';
import {
  fetchDashboardStats,
  fetchRecentApplications,
  fetchUpcomingEvents,
  type DashboardStats,
  type RecentApplication,
  type DashboardEvent,
} from '../../lib/services/dashboardService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboardStats, applications, events] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentApplications(),
          fetchUpcomingEvents(),
        ]);

        setStats(dashboardStats);
        setRecentApplications(applications);
        setUpcomingEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Applications',
      value: stats?.total_applications || 0,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Events',
      value: stats?.total_events || 0,
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Active Volunteers',
      value: stats?.active_volunteers || 0,
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.first_name || 'User'}!
        </h2>
        <p className="text-indigo-100">
          Here's what's happening with FOROZ today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-slate-500">No recent applications available yet.</p>
            ) : (
              recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {application.applicant_name.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{application.applicant_name}</p>
                      <p className="text-xs text-slate-500">{application.program_name}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {application.status}
                  </span>
                </div>
              ))
            )}
          </div>
          <a href="/admin/applications" className="mt-4 block text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all applications →
          </a>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming events available right now.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 py-3 border-b border-slate-100 last:border-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.event_date}{event.location ? ` • ${event.location}` : ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <a href="/admin/events" className="mt-4 block text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all events →
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="/admin/applications"
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            <FileText className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Review Applications</span>
          </a>
          <a
            href="/admin/events"
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
          >
            <Calendar className="h-8 w-8 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Manage Events</span>
          </a>
          <a
            href="/admin/announcements"
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <Megaphone className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Post Announcement</span>
          </a>
          <a
            href="/admin/messages"
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
          >
            <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Send Message</span>
          </a>
        </div>
      </div>
    </div>
  );
};

