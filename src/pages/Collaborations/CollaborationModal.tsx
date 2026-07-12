import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileImageUpload } from '../../components/FileImageUpload/FileImageUpload';
import type { Collaboration } from '../../types/Collaboration';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Collaboration, 'id'> & { logoFile?: File | null }) => void;
  initial?: Collaboration | null;
}
const EMPTY: Omit<Collaboration, 'id'> & { logoFile?: File | null } = {
  organizationName: '',
  shortDescription: '',
  collaborationText: '',
  date: new Date().toISOString().split('T')[0],
  logo: '',
  websiteLink: ''
};
export function CollaborationModal({
  isOpen,
  onClose,
  onSave,
  initial
}: Props) {
  const [form, setForm] = useState<Omit<Collaboration, 'id'> & { logoFile?: File | null }>(EMPTY);
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
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.organizationName.trim())
    e.organizationName = 'Organization name is required';
    if (!form.collaborationText.trim())
    e.collaborationText = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    if (form.websiteLink && !/^https?:\/\//i.test(form.websiteLink)) {
      e.websiteLink = 'Website must start with http:// or https://';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Collaboration' : 'New Collaboration'}
      size="xl">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <Input
            value={form.organizationName}
            onChange={(e) =>
            setForm({
              ...form,
              organizationName: e.target.value
            })
            } />
          
          {errors.organizationName &&
          <p className="mt-1 text-xs text-rose-600">
              {errors.organizationName}
            </p>
          }
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <Input
            value={form.shortDescription || ''}
            onChange={(e) =>
            setForm({
              ...form,
              shortDescription: e.target.value
            })
            }
            placeholder="Brief summary" />
        </div>

        <Textarea
          label="Collaboration Details"
          rows={4}
          value={form.collaborationText}
          onChange={(e) =>
          setForm({
            ...form,
            collaborationText: e.target.value
          })
          } />
        
        {errors.collaborationText &&
        <p className="-mt-2 text-xs text-rose-600">
            {errors.collaborationText}
          </p>
        }

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
              })
              } />
            
            {errors.date &&
            <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website (optional)
            </label>
            <Input
              value={form.websiteLink || ''}
              onChange={(e) =>
              setForm({
                ...form,
                websiteLink: e.target.value
              })
              }
              placeholder="https://..." />
            
            {errors.websiteLink &&
            <p className="mt-1 text-xs text-rose-600">{errors.websiteLink}</p>
            }
          </div>
        </div>

        <FileImageUpload
          label="Logo (optional)"
          value={form.logo}
          onChange={(file) => {
            if (!file) {
              setForm({
                ...form,
                logo: '',
                logoFile: null
              });
            } else {
              setForm({
                ...form,
                logo: URL.createObjectURL(file),
                logoFile: file
              });
            }
          }} />
        

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initial ? 'Save Changes' : 'Add Collaboration'}
          </Button>
        </div>
      </form>
    </Modal>);

}