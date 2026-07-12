import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileImageUpload } from '../../components/FileImageUpload/FileImageUpload';
import type { Announcement } from '../../types/Announcement';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Announcement, 'id'> & { imageFile?: File | null }) => void;
  initial?: Announcement | null;
}
const EMPTY: Omit<Announcement, 'id'> & { imageFile?: File | null } = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  expirationDate: '',
  postedBy: '',
  link: '',
  image: ''
};
export function AnnouncementModal({ isOpen, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Omit<Announcement, 'id'> & { imageFile?: File | null }>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (isOpen) {
      setForm(
        initial ?
        {
          ...initial
        } :
        EMPTY
      );
      setErrors({});
    }
  }, [isOpen, initial]);
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.expirationDate) e.expirationDate = 'Expiration date is required';else
    if (form.expirationDate <= form.date)
    e.expirationDate = 'Expiration must be after the publish date';
    if (!form.postedBy.trim()) e.postedBy = 'Posted by is required';
    if (form.link && !/^https?:\/\//i.test(form.link))
    e.link = 'Link must start with http:// or https://';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };
  const update = <K extends keyof typeof form,>(
  key: K,
  value: (typeof form)[K]) =>
  {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Announcement' : 'New Announcement'}
      size="xl">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Announcement title" />
          
          {errors.title &&
          <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
          }
        </div>

        <Textarea
          label="Description"
          rows={4}
          value={form.description}
          onChange={(e) => update('description', e.target.value)} />
        
        {errors.description &&
        <p className="-mt-2 text-xs text-rose-600">{errors.description}</p>
        }

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)} />
            
            {errors.date &&
            <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <Input
              type="date"
              value={form.expirationDate}
              onChange={(e) => update('expirationDate', e.target.value)} />
            
            {errors.expirationDate &&
            <p className="mt-1 text-xs text-rose-600">
                {errors.expirationDate}
              </p>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posted By
            </label>
            <Input
              value={form.postedBy}
              onChange={(e) => update('postedBy', e.target.value)} />
            
            {errors.postedBy &&
            <p className="mt-1 text-xs text-rose-600">{errors.postedBy}</p>
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (optional)
            </label>
            <Input
              value={form.link || ''}
              onChange={(e) => update('link', e.target.value)}
              placeholder="https://..." />
            
            {errors.link &&
            <p className="mt-1 text-xs text-rose-600">{errors.link}</p>
            }
          </div>
        </div>

        <FileImageUpload
          label="Image (optional)"
          value={form.image}
          onChange={(file) => {
            if (!file) {
              update('image', '');
              setForm((prev) => ({ ...prev, imageFile: null }));
            } else {
              update('image', URL.createObjectURL(file));
              setForm((prev) => ({ ...prev, imageFile: file }));
            }
          }} />
        

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initial ? 'Save Changes' : 'Create Announcement'}
          </Button>
        </div>
      </form>
    </Modal>);

}