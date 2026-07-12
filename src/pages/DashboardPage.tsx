import React, { useEffect, useState } from 'react';
import {
  FileText,
  Calendar,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  Megaphone,
  MessageSquare,
  ArrowRight } from
'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../config';
import { getVolunteers, type VolunteerApplication } from '../services/applicationsService';

interface DashboardSummary {
  total: number;
  pending: number;
  approved: number;
  approval_rate: number;
}

const DASHBOARD_ENDPOINT = `${API_BASE}/get_dashboard_data/`;

export function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const fullNameSafe = currentUser?.fullName ?? currentUser?.username ?? '';
  const firstName = (fullNameSafe.split(' ')[0] || 'there');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentApplications, setRecentApplications] = useState<VolunteerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(DASHBOARD_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as Partial<DashboardSummary>;
        const volunteers = await getVolunteers();

        if (!isMounted) return;

        setSummary({
          total: Number(data.total ?? 0),
          pending: Number(data.pending ?? 0),
          approved: Number(data.approved ?? 0),
          approval_rate: Number(data.approval_rate ?? 0)
        });
        const sortedVolunteers = [...volunteers].sort((a, b) => {
          const timeA = new Date(a.date || 0).getTime();
          const timeB = new Date(b.date || 0).getTime();
          return timeB - timeA;
        });

        setRecentApplications(sortedVolunteers.slice(0, 3));
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-purple-600 rounded-xl p-6 text-white shadow-sm">
        <h2 className="text-2xl font-bold mb-1">Welcome back, {firstName}!</h2>
        <p className="text-purple-100">
          Here's what's happening with FOROZ today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Applications"
          value={isLoading ? 'Loading...' : summary?.total?.toString() ?? '0'}
          icon={FileText}
          color="blue" />
        <StatCard
          title="Pending Applications"
          value={isLoading ? 'Loading...' : summary?.pending?.toString() ?? '0'}
          icon={ClipboardList}
          color="purple" />
        <StatCard
          title="Approved Applications"
          value={isLoading ? 'Loading...' : summary?.approved?.toString() ?? '0'}
          icon={Calendar}
          color="emerald" />
        <StatCard
          title="Approval Rate"
          value={isLoading ? 'Loading...' : `${(summary?.approval_rate ?? 0).toFixed(1)}%`}
          icon={TrendingUp}
          color="amber" />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Applications
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            {recentApplications.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {recentApplications.map((application) => (
                  <li key={application.id} className="rounded-lg border border-gray-200 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.name}</p>
                        <p className="text-xs text-gray-500">{application.email}</p>
                      </div>
                      <span className="text-xs font-medium text-purple-600">{application.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                No recent applications available yet.
              </p>
            )}
            <Link
              to="/applications"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 w-fit">
              
              View all applications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-4">
              No upcoming events available right now.
            </p>
            <Link
              to="/events"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 w-fit">
              
              View all events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/applications')}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Review Applications
            </span>
          </button>

          <button
            onClick={() => navigate('/events')}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <CalendarDays className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Manage Events
            </span>
          </button>

          <button
            onClick={() => navigate('/announcements')}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Post Announcement
            </span>
          </button>

          <button
            onClick={() => navigate('/messages')}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Send Message
            </span>
          </button>
        </div>
      </div>
    </div>);

}