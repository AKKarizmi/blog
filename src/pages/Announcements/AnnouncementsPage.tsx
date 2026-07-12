import React, { useEffect, useState } from 'react';
import { Plus, Megaphone, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  DataTable,
  DataTableColumn
} from '../../components/DataTable/DataTable';
import { AnnouncementModal } from './AnnouncementModal';
import { useApp } from '../../context/AppContext';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement
} from '../../services/announcementsService';
import { formatDate, isExpired } from '../../utils/date';
import type { Announcement } from '../../types/Announcement';

type FilterType = 'all' | 'active' | 'expired';

export function AnnouncementsPage() {
  const { addToast } = useApp();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [toDelete, setToDelete] = useState<Announcement | null>(null);

  const load = () => {
    setLoading(true);
    setError(undefined);
    getAnnouncements()
      .then(setAnnouncements)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = announcements.filter((a) => {
    if (filter === 'active') return !isExpired(a.expirationDate);
    if (filter === 'expired') return isExpired(a.expirationDate);
    return true;
  });

  const handleSave = async (data: Omit<Announcement, 'id'> & { imageFile?: File | null }) => {
    try {
      if (editing) {
        const updated = await updateAnnouncement(editing.id, data);
        setAnnouncements((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
        addToast('Announcement updated', 'success');
      } else {
        const created = await createAnnouncement(data);
        setAnnouncements((prev) => [created, ...prev]);
        addToast('Announcement created', 'success');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save announcement', 'error');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteAnnouncement(toDelete.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== toDelete.id));
      addToast('Announcement deleted', 'success');
      setToDelete(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to delete announcement', 'error');
    }
  };
  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (a: Announcement) => {
    setEditing(a);
    setModalOpen(true);
  };
  const columns: DataTableColumn<Announcement>[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    render: (a) =>
    <div className="flex items-center gap-3">
          {a.image ?
      <img
        src={a.image}
        alt=""
        className="w-10 h-10 rounded-md object-cover border border-gray-200" /> :


      <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-indigo-500" />
            </div>
      }
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{a.title}</div>
            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
              {a.description}
            </div>
          </div>
        </div>

  },
  {
    key: 'postedBy',
    label: 'Posted By',
    sortable: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (a) => formatDate(a.date)
  },
  {
    key: 'expirationDate',
    label: 'Expires',
    sortable: true,
    render: (a) => formatDate(a.expirationDate)
  },
  {
    key: 'status',
    label: 'Status',
    render: (a) =>
    isExpired(a.expirationDate) ?
    <Badge variant="neutral">Expired</Badge> :

    <Badge variant="success">Active</Badge>

  },
  {
    key: 'actions',
    label: '',
    render: (a) =>
    <div className="flex justify-end gap-1">
          {a.link &&
      <a
        href={a.link}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
        aria-label="Open link">
        
              <ExternalLink className="w-4 h-4" />
            </a>
      }
          <button
        onClick={() => openEdit(a)}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
        aria-label="Edit">
        
            <Edit2 className="w-4 h-4" />
          </button>
          <button
        onClick={() => setToDelete(a)}
        className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
        aria-label="Delete">
        
            <Trash2 className="w-4 h-4" />
          </button>
        </div>,

    className: 'text-right'
  }];

  const FilterButton = ({
    value,
    label



  }: {value: FilterType;label: string;}) =>
  <button
    onClick={() => setFilter(value)}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
    
      {label}
    </button>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish news and updates for your community.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100 w-fit">
        <FilterButton value="all" label="All" />
        <FilterButton value="active" label="Active" />
        <FilterButton value="expired" label="Expired" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        searchPlaceholder="Search announcements..."
        emptyMessage="No announcements yet"
        emptyIcon={Megaphone}
        emptyAction={{
          label: 'Create your first announcement',
          onClick: openCreate
        }} />
      

      <AnnouncementModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing} />
      

      <ConfirmDialog
        isOpen={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={
        toDelete ? `Delete "${toDelete.title}"? This cannot be undone.` : ''
        } />
      
    </div>);

}