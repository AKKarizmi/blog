import React, { useEffect, useState } from 'react';
import { Plus, Handshake, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  DataTable,
  DataTableColumn
} from '../../components/DataTable/DataTable';
import { CollaborationModal } from './CollaborationModal';
import { useApp } from '../../context/AppContext';
import {
  createCollaboration,
  deleteCollaboration,
  getCollaborations,
  updateCollaboration
} from '../../services/collaborationsService';
import { formatDate } from '../../utils/date';
import type { Collaboration } from '../../types/Collaboration';

export function CollaborationsPage() {
  const { addToast } = useApp();
  const [items, setItems] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collaboration | null>(null);
  const [toDelete, setToDelete] = useState<Collaboration | null>(null);

  const load = () => {
    setLoading(true);
    setError(undefined);
    getCollaborations()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Omit<Collaboration, 'id'> & { logoFile?: File | null }) => {
    try {
      if (editing) {
        const updated = await updateCollaboration(editing.id, data);
        setItems((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        addToast('Collaboration updated', 'success');
      } else {
        const created = await createCollaboration(data);
        setItems((prev) => [created, ...prev]);
        addToast('Collaboration added', 'success');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save collaboration', 'error');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCollaboration(toDelete.id);
      setItems((prev) => prev.filter((c) => c.id !== toDelete.id));
      addToast('Collaboration deleted', 'success');
      setToDelete(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to delete collaboration', 'error');
    }
  };
  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const getInitials = (name: string) =>
  name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
  const columns: DataTableColumn<Collaboration>[] = [
  {
    key: 'organizationName',
    label: 'Organization',
    sortable: true,
    render: (c) =>
    <div className="flex items-center gap-3">
          {c.logo ?
      <img
        src={c.logo}
        alt=""
        className="w-10 h-10 rounded-lg object-cover border border-gray-200" /> :


      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(c.organizationName)}
            </div>
      }
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {c.organizationName}
            </div>
            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
              {c.shortDescription || c.collaborationText}
            </div>
          </div>
        </div>

  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (c) => formatDate(c.date)
  },
  {
    key: 'website',
    label: 'Website',
    render: (c) =>
    c.websiteLink ?
    <a
      href={c.websiteLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
      
            Visit <ExternalLink className="w-3 h-3" />
          </a> :

    <span className="text-xs text-gray-400">—</span>

  },
  {
    key: 'actions',
    label: 'Actions',
    className: 'text-right',
    render: (c) =>
    <div className="flex justify-end gap-1">
          <button
        onClick={() => {
          setEditing(c);
          setModalOpen(true);
        }}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
        aria-label="Edit">
        
            <Edit2 className="w-4 h-4" />
          </button>
          <button
        onClick={() => setToDelete(c)}
        className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
        aria-label="Delete">
        
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Partner organizations and joint initiatives.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Collaboration
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        onRetry={load}
        searchPlaceholder="Search collaborations..."
        emptyMessage="No collaborations yet"
        emptyIcon={Handshake}
        emptyAction={{
          label: 'Add your first collaboration',
          onClick: openCreate
        }} />
      

      <CollaborationModal
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
        title="Delete Collaboration"
        message={
        toDelete ?
        `Delete the collaboration with ${toDelete.organizationName}?` :
        ''
        } />
      
    </div>);

}