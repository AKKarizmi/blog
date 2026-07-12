import React, { useEffect, useMemo, useState } from 'react';
import { Search, Download, Filter, Eye, Trash2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csv';
import { formatDate } from '../utils/date';
import { deleteVolunteer, getVolunteers, updateVolunteerStatus, viewVolunteer, type VolunteerApplication } from '../services/applicationsService';

export function ApplicationTable() {
  const { addToast } = useApp();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toDelete, setToDelete] = useState<VolunteerApplication | null>(null);
  const [viewing, setViewing] = useState<VolunteerApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const filteredData = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);
  useEffect(() => {
    let isMounted = true;

    async function loadApplications() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getVolunteers();
        if (!isMounted) return;
        setApplications(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load applications.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success' as const;
      case 'Pending':
        return 'warning' as const;
      case 'Rejected':
        return 'danger' as const;
      default:
        return 'neutral' as const;
    }
  };
  const getInitials = (name: string) =>
  name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
  const getColor = (name: string) => {
    const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700'];

    return colors[name.length % colors.length];
  };
  const handleExport = () => {
    if (filteredData.length === 0) {
      addToast('No applications to export', 'error');
      return;
    }
    exportToCSV(
      filteredData.map((a) => ({
        ID: a.id,
        Name: a.name,
        Email: a.email,
        Phone: a.phone,
        Roles: a.roles.join('; '),
        Status: a.status,
        Date: a.date
      })),
      'applications'
    );
    addToast(`Exported ${filteredData.length} applications`, 'success');
  };
  const handleView = async (app: VolunteerApplication) => {
    try {
      const detail = await viewVolunteer(app.id);
      setViewing(detail);
    } catch {
      addToast('Unable to load application details', 'error');
    }
  };
  const handleStatusChange = async (status: VolunteerApplication['status']) => {
    if (!viewing) return;

    try {
      setIsUpdating(true);
      const updated = await updateVolunteerStatus(viewing.id, status);
      setApplications((prev) => prev.map((app) => (app.id === updated.id ? updated : app)));
      setViewing(updated);
      addToast(`Application marked as ${status.toLowerCase()}`, 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to update application status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;

    try {
      await deleteVolunteer(toDelete.id);
      setApplications((prev) => prev.filter((app) => app.id !== toDelete.id));
      if (viewing?.id === toDelete.id) {
        setViewing(null);
      }
      addToast('Application removed', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to delete application', 'error');
    } finally {
      setToDelete(null);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <Input
            placeholder="Search by name or email..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
          
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status">
              
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <Filter className="w-4 h-4" />
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            onClick={handleExport}>
            
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Card className="overflow-hidden shadow-md border-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${getColor(app.name)}`}>
                          {getInitials(app.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {app.name}
                          </div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {app.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="neutral"
                            className="bg-gray-100 text-gray-600 border border-gray-200">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {formatDate(app.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-900 border-indigo-200 hover:bg-indigo-50"
                          onClick={() => handleView(app)}
                          aria-label={`View ${app.name}'s application`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:text-rose-900 hover:bg-rose-50"
                          onClick={() => setToDelete(app)}
                          aria-label={`Delete ${app.name}'s application`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900">
                        No applications found
                      </p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredData.length}</span>{' '}
            results
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        message={toDelete ? `Remove ${toDelete.name}'s application? This cannot be undone.` : ''}
      />

      <ApplicationDetailModal
        application={viewing}
        onClose={() => setViewing(null)}
        onStatusChange={handleStatusChange}
        onDelete={() => {
          if (viewing) {
            setToDelete(viewing);
            setViewing(null);
          }
        }}
        isUpdating={isUpdating}
      />
      
    </div>);

}