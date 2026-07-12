import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Users as UsersIcon,
  MoreVertical,
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  MessageSquare } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  DataTable,
  DataTableColumn } from
'../../components/DataTable/DataTable';
import { UserModal } from './UserModal';
import { useApp } from '../../context/AppContext';
import { getUsers } from '../../services/usersService';
import { formatDate } from '../../utils/date';
import type { User } from '../../types/User';
type RoleFilter = 'all' | User['role'];
type StatusFilter = 'all' | User['status'];
export function UsersPage() {
  const { addToast } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<{
    user: User;
    action: 'delete' | 'suspend' | 'reactivate';
  } | null>(null);
  const [messageTarget, setMessageTarget] = useState<User | null>(null);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const load = () => {
    setLoading(true);
    setError(undefined);
    getUsers().
    then(setUsers).
    catch((e) => setError(e.message)).
    finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });
  const handleSave = (data: Omit<User, 'id' | 'createdAt'>) => {
    if (editing) {
      setUsers((prev) =>
      prev.map((u) =>
      u.id === editing.id ?
      {
        ...u,
        ...data
      } :
      u
      )
      );
      addToast('User updated', 'success');
    } else {
      setUsers((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data
      },
      ...prev]
      );
      addToast('User created', 'success');
    }
    setModalOpen(false);
    setEditing(null);
  };
  const handleConfirm = () => {
    if (!confirm) return;
    const { user, action } = confirm;
    if (action === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      addToast(`${user.username} deleted`, 'success');
    } else if (action === 'suspend') {
      setUsers((prev) =>
      prev.map((u) =>
      u.id === user.id ?
      {
        ...u,
        status: 'suspended'
      } :
      u
      )
      );
      addToast(`${user.username} suspended`, 'success');
    } else if (action === 'reactivate') {
      setUsers((prev) =>
      prev.map((u) =>
      u.id === user.id ?
      {
        ...u,
        status: 'active'
      } :
      u
      )
      );
      addToast(`${user.username} reactivated`, 'success');
    }
    setConfirm(null);
  };
  const sendMessage = () => {
    if (!msgSubject.trim() || !msgBody.trim()) {
      addToast('Subject and message are required', 'error');
      return;
    }
    addToast(`Message sent to ${messageTarget?.username}`, 'success');
    setMessageTarget(null);
    setMsgSubject('');
    setMsgBody('');
  };
  const getInitials = (name: string) =>
  name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
  const roleBadge = (role: User['role']) => {
    const map = {
      admin: {
        variant: 'danger' as const,
        label: 'Admin'
      },
      moderator: {
        variant: 'warning' as const,
        label: 'Moderator'
      },
      volunteer: {
        variant: 'success' as const,
        label: 'Volunteer'
      }
    };
    return <Badge variant={map[role].variant}>{map[role].label}</Badge>;
  };
  const columns: DataTableColumn<User>[] = [
  {
    key: 'user',
    label: 'User',
    render: (u) =>
    <div className="flex items-center gap-3">
          {u.avatar ?
      <img
        src={u.avatar}
        alt=""
        className="w-9 h-9 rounded-full object-cover border border-gray-200" /> :


      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(u.fullName)}
            </div>
      }
          <div>
            <div
          className={`text-sm font-medium text-gray-900 ${u.status === 'suspended' ? 'opacity-60 italic' : ''}`}>
          
              {u.username}
            </div>
            <div className="text-xs text-gray-500">{u.fullName}</div>
          </div>
        </div>

  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'role',
    label: 'Role',
    render: (u) => roleBadge(u.role)
  },
  {
    key: 'status',
    label: 'Status',
    render: (u) =>
    u.status === 'active' ?
    <Badge variant="success">Active</Badge> :

    <Badge variant="danger">Suspended</Badge>

  },
  {
    key: 'createdAt',
    label: 'Joined',
    sortable: true,
    render: (u) => formatDate(u.createdAt)
  },
  {
    key: 'actions',
    label: '',
    className: 'text-right',
    render: (u) =>
    <UserActionsMenu
      user={u}
      onEdit={(user) => {
        setEditing(user);
        setModalOpen(true);
      }}
      onAction={setConfirm}
      onMessage={setMessageTarget} />


  }];

  const FilterChip = ({
    active,
    label,
    onClick




  }: {active: boolean;label: string;onClick: () => void;}) =>
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
    
      {label}
    </button>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage accounts, roles, and access.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}>
          
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <span className="px-2 self-center text-xs font-medium text-gray-500">
            Role:
          </span>
          <FilterChip
            active={roleFilter === 'all'}
            label="All"
            onClick={() => setRoleFilter('all')} />
          
          <FilterChip
            active={roleFilter === 'admin'}
            label="Admin"
            onClick={() => setRoleFilter('admin')} />
          
          <FilterChip
            active={roleFilter === 'moderator'}
            label="Moderator"
            onClick={() => setRoleFilter('moderator')} />
          
          <FilterChip
            active={roleFilter === 'volunteer'}
            label="Volunteer"
            onClick={() => setRoleFilter('volunteer')} />
          
        </div>
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <span className="px-2 self-center text-xs font-medium text-gray-500">
            Status:
          </span>
          <FilterChip
            active={statusFilter === 'all'}
            label="All"
            onClick={() => setStatusFilter('all')} />
          
          <FilterChip
            active={statusFilter === 'active'}
            label="Active"
            onClick={() => setStatusFilter('active')} />
          
          <FilterChip
            active={statusFilter === 'suspended'}
            label="Suspended"
            onClick={() => setStatusFilter('suspended')} />
          
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        searchPlaceholder="Search users..."
        emptyMessage="No users found"
        emptyIcon={UsersIcon} />
      

      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing} />
      

      <ConfirmDialog
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={
        confirm?.action === 'delete' ?
        'Delete User' :
        confirm?.action === 'suspend' ?
        'Suspend User' :
        'Reactivate User'
        }
        message={
        confirm ?
        confirm.action === 'delete' ?
        `Delete ${confirm.user.username}? This cannot be undone.` :
        confirm.action === 'suspend' ?
        `Suspend ${confirm.user.username}? They will lose access.` :
        `Reactivate ${confirm.user.username}?` :
        ''
        } />
      

      <Modal
        isOpen={messageTarget !== null}
        onClose={() => setMessageTarget(null)}
        title={`Send message to ${messageTarget?.username || ''}`}
        size="md">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <Input
              value={messageTarget?.email || ''}
              readOnly
              className="bg-gray-50" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input
              value={msgSubject}
              onChange={(e) => setMsgSubject(e.target.value)} />
            
          </div>
          <Textarea
            label="Message"
            rows={5}
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)} />
          
          <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setMessageTarget(null)}>
              Cancel
            </Button>
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </Modal>
    </div>);

}
interface ActionsMenuProps {
  user: User;
  onEdit: (u: User) => void;
  onAction: (a: {
    user: User;
    action: 'delete' | 'suspend' | 'reactivate';
  }) => void;
  onMessage: (u: User) => void;
}
function UserActionsMenu({
  user,
  onEdit,
  onAction,
  onMessage
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
        aria-label="More actions">
        
        <MoreVertical className="w-4 h-4" />
      </button>
      {open &&
      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
          <button
          onClick={() => {
            setOpen(false);
            onEdit(user);
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          {user.status === 'active' ?
        <button
          onClick={() => {
            setOpen(false);
            onAction({
              user,
              action: 'suspend'
            });
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          
              <UserX className="w-4 h-4" /> Suspend
            </button> :

        <button
          onClick={() => {
            setOpen(false);
            onAction({
              user,
              action: 'reactivate'
            });
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          
              <UserCheck className="w-4 h-4" /> Reactivate
            </button>
        }
          <button
          onClick={() => {
            setOpen(false);
            onMessage(user);
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          
            <MessageSquare className="w-4 h-4" /> Send Message
          </button>
          <button
          onClick={() => {
            setOpen(false);
            onAction({
              user,
              action: 'delete'
            });
          }}
          className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
          
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      }
    </div>);

}