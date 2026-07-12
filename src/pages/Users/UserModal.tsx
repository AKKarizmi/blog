import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileImageUpload } from '../../components/FileImageUpload/FileImageUpload';
import type { User } from '../../types/User';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<User, 'id' | 'createdAt'>) => void;
  initial?: User | null;
}
interface FormState {
  username: string;
  email: string;
  fullName: string;
  role: User['role'];
  status: User['status'];
  avatar?: string;
  password: string;
  confirmPassword: string;
}
const EMPTY: FormState = {
  username: '',
  email: '',
  fullName: '',
  role: 'volunteer',
  status: 'active',
  avatar: '',
  password: '',
  confirmPassword: ''
};
export function UserModal({ isOpen, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!initial;
  useEffect(() => {
    if (isOpen) {
      setForm(
        initial ?
        {
          username: initial.username,
          email: initial.email,
          fullName: initial.fullName,
          role: initial.role,
          status: initial.status,
          avatar: initial.avatar || '',
          password: '',
          confirmPassword: ''
        } :
        EMPTY
      );
      setErrors({});
    }
  }, [isOpen, initial]);
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Username is required';else
    if (form.username.length < 3)
    e.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) e.email = 'Email is required';else
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Invalid email format';
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!isEdit) {
      if (!form.password) e.password = 'Password is required';else
      if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters';
      if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      username: form.username,
      email: form.email,
      fullName: form.fullName,
      role: form.role,
      status: form.status,
      avatar: form.avatar || undefined
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'New User'}
      size="lg">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileImageUpload
          label="Avatar (optional)"
          value={form.avatar}
          onChange={(file) => {
            if (!file)
            setForm({
              ...form,
              avatar: ''
            });else

            setForm({
              ...form,
              avatar: URL.createObjectURL(file)
            });
          }} />
        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username{' '}
              <span className="text-xs text-gray-400">
                ({form.username.length} chars)
              </span>
            </label>
            <Input
              value={form.username}
              onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value
              })
              } />
            
            {errors.username &&
            <p className="mt-1 text-xs text-rose-600">{errors.username}</p>
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              value={form.fullName}
              onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value
              })
              } />
            
            {errors.fullName &&
            <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
            }
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
            } />
          
          {errors.email &&
          <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
          }
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as User['role']
              })
              }
              className="block w-full rounded-lg border-gray-300 border bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              
              <option value="volunteer">Volunteer</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as User['status']
              })
              }
              className="block w-full rounded-lg border-gray-300 border bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {!isEdit &&
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
              type="password"
              value={form.password}
              onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
              } />
            
              {errors.password &&
            <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
            }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value
              })
              } />
            
              {errors.confirmPassword &&
            <p className="mt-1 text-xs text-rose-600">
                  {errors.confirmPassword}
                </p>
            }
            </div>
          </div>
        }

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>);

}