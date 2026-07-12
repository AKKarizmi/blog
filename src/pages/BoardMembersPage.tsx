import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Linkedin,
  Facebook,
  Instagram,
  User,
  Loader2,
  Mail,
  Globe2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { FileImageUpload } from '../components/FileImageUpload/FileImageUpload';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useApp } from '../context/AppContext';
import {
  createBoardMember,
  deleteBoardMember,
  getBoardMembers,
  sendEmailToBoardMember,
  type BoardMember,
  updateBoardMember
} from '../services/boardMembersService';

type SocialField = {
  id: string;
  platform: string;
  url: string;
};

function parseRoles(value?: string): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim());
      }
    } catch {
      // fall back to comma splitting below
    }
  }

  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function BoardMembersPage() {
  const { addToast } = useApp();
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [formData, setFormData] = useState<Partial<BoardMember> & { photoFile?: File | null }>({
    socials: {},
    email: ''
  });
  const [socialFields, setSocialFields] = useState<SocialField[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailMember, setEmailMember] = useState<BoardMember | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailAttachment, setEmailAttachment] = useState<File | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let mounted = true;

    async function loadMembers() {
      try {
        const data = await getBoardMembers();
        if (mounted) {
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to load board members', error);
        if (mounted) {
          addToast('Failed to load board members', 'error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      mounted = false;
    };
  }, [addToast]);
  const handleOpenModal = (member?: BoardMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        ...member,
        email: member.email || '',
        socials: {
          ...member.socials
        }
      });
      setRoles(parseRoles(member.role));
      setRoleInput('');
      setSocialFields(
        Object.entries(member.socials ?? {})
          .filter(([, value]): value is [string, string] => typeof value === 'string' && value.trim().length > 0)
          .map(([platform, url], index) => ({
            id: `${platform}-${index}`,
            platform,
            url
          }))
      );
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        email: '',
        shortDesc: '',
        photo: '',
        photoFile: null,
        socials: {}
      });
      setRoles([]);
      setRoleInput('');
      setSocialFields([]);
    }
    setIsModalOpen(true);
  };
  const handleSave = async () => {
    const rolePayload = roles.length > 0 ? roles : parseRoles(formData.role || '');

    if (!formData.name || rolePayload.length === 0) {
      addToast('Name and at least one role are required', 'error');
      return;
    }

    try {
      const socialPayload = socialFields
        .filter((field) => field.url.trim())
        .map((field) => ({ platform: field.platform, url: field.url.trim() }));

      if (editingMember) {
        const updatedMember = await updateBoardMember(editingMember.id, {
          name: formData.name || '',
          role: rolePayload.join(', '),
          roles: rolePayload,
          email: formData.email || '',
          shortDesc: formData.shortDesc || '',
          photo: formData.photo || '',
          photoFile: formData.photoFile ?? null,
          socials: formData.socials || {},
          socialPayload
        });
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? updatedMember : m)));
        addToast('Board member updated successfully', 'success');
      } else {
        const newMember = await createBoardMember({
          name: formData.name || '',
          role: rolePayload.join(', '),
          roles: rolePayload,
          email: formData.email || '',
          shortDesc: formData.shortDesc || '',
          photo: formData.photo || '',
          photoFile: formData.photoFile ?? null,
          socials: formData.socials || {},
          socialPayload
        });
        setMembers((prev) => [newMember, ...prev]);
        addToast('Board member added successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save board member', error);
      addToast('Failed to save board member', 'error');
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) {
      return;
    }

    try {
      await deleteBoardMember(memberToDelete);
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete));
      addToast('Board member deleted successfully', 'success');
      setMemberToDelete(null);
    } catch (error) {
      console.error('Failed to delete board member', error);
      addToast('Failed to delete board member', 'error');
    } finally {
      setIsDeleteOpen(false);
    }
  };
  const addSocialField = () => {
    setSocialFields((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, platform: '', url: '' }
    ]);
  };

  const removeSocialField = (id: string) => {
    setSocialFields((prev) => prev.filter((field) => field.id !== id));
    setFormData((prev) => {
      const nextSocials = { ...(prev.socials ?? {}) };
      const removedField = socialFields.find((field) => field.id === id);
      if (removedField?.platform) {
        delete nextSocials[removedField.platform];
      }
      return { ...prev, socials: nextSocials };
    });
  };

  const handleSocialChange = (id: string, value: string) => {
    setSocialFields((prev) => {
      const next = prev.map((field) => (field.id === id ? { ...field, url: value } : field));
      const field = next.find((item) => item.id === id);
      if (field?.platform) {
        setFormData((current) => ({
          ...current,
          socials: {
            ...(current.socials ?? {}),
            [field.platform]: value
          }
        }));
      }
      return next;
    });
  };

  const handlePlatformChange = (id: string, platform: string) => {
    setSocialFields((prev) => {
      const existingField = prev.find((field) => field.id === id);
      const next = prev.map((field) => (field.id === id ? { ...field, platform, url: field.url } : field));
      const updatedField = next.find((field) => field.id === id);
      setFormData((current) => {
        const nextSocials = { ...(current.socials ?? {}) };
        if (existingField?.platform && existingField.platform !== platform) {
          delete nextSocials[existingField.platform];
        }
        return {
          ...current,
          socials: {
            ...nextSocials,
            [platform]: updatedField?.url || ''
          }
        };
      });
      return next;
    });
  };

  const handleAddRole = () => {
    const nextRole = roleInput.trim();
    if (!nextRole) return;
    if (!roles.includes(nextRole)) {
      setRoles((prev) => [...prev, nextRole]);
    }
    setRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles((prev) => prev.filter((role) => role !== roleToRemove));
  };

  const handleOpenEmailModal = (member: BoardMember) => {
    setEmailMember(member);
    setEmailSubject('');
    setEmailBody('');
    setEmailAttachment(null);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailMember || !emailSubject.trim() || !emailBody.trim()) {
      addToast('Subject and body are required', 'error');
      return;
    }

    try {
      setEmailSending(true);
      await sendEmailToBoardMember(emailMember.id, {
        subject: emailSubject.trim(),
        body: emailBody.trim(),
        attachment: emailAttachment
      });
      addToast('Email sent successfully', 'success');
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error('Failed to send email', error);
      addToast('Failed to send email', 'error');
    } finally {
      setEmailSending(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Board Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the experts and leadership team.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search members..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Socials
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading members...
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.photo ? (
                        <img
                          src={member.photo.startsWith('http') ? member.photo : `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}${member.photo}`}
                          alt={member.name}
                          className="h-12 w-12 rounded-full object-cover mr-4 border border-gray-200"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border border-gray-200">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-indigo-600">
                          {member.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                      {member.shortDesc}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(member.socials ?? {})
                        .filter(([, value]): value is [string, string] => typeof value === 'string' && value.trim().length > 0)
                        .map(([platform, url]) => {
                        const label = platform.toLowerCase();
                        const icon = label.includes('linkedin') ? (
                          <Linkedin className="h-4 w-4" />
                        ) : label.includes('facebook') ? (
                          <Facebook className="h-4 w-4" />
                        ) : label.includes('instagram') ? (
                          <Instagram className="h-4 w-4" />
                        ) : label.includes('github') ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.02c-3.2.69-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.26 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.66.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
                        ) : label.includes('youtube') ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M23.5 7.2a3.02 3.02 0 0 0-2.12-2.14C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 7.2 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .5 4.8 3.02 3.02 0 0 0 2.12 2.14C4.5 19.5 12 19.5 12 19.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.5-4.8ZM9.75 15.5V8.5l6.25 3.5-6.25 3.5Z"/></svg>
                        ) : (
                          <Globe2 className="h-4 w-4" />
                        );
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                            aria-label={`Open ${member.name} ${platform}`}
                          >
                            {icon}
                          </a>
                        );
                      })}
                      {Object.keys(member.socials ?? {}).length === 0 && <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEmailModal(member)}
                      className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50">
                      
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(member)}
                      className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50">
                      
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMemberToDelete(member.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-rose-600 hover:text-rose-900 hover:bg-rose-50">
                      
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No board members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Board Member' : 'Add Board Member'}
        size="lg">
        
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-xs">
              <FileImageUpload
                label="Photo"
                value={formData.photo || ''}
                onChange={(file) => {
                  setFormData((prev) => ({
                    ...prev,
                    photo: file ? URL.createObjectURL(file) : prev.photo || '',
                    photoFile: file
                  }));
                }} />
              
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Title)
            </label>
            <Input
              value={formData.name || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value
                }))
              }
              placeholder="e.g. Dr. Jane Smith" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value
                }))
              }
              placeholder="e.g. jane@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {roles.map((role) => (
                <span key={role} className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="ml-2 text-indigo-500 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddRole();
                  }
                }}
                placeholder="Type a role and press Enter" />
              <Button type="button" variant="outline" onClick={handleAddRole}>
                Add
              </Button>
            </div>
          </div>
          <Textarea
            label="Short Description"
            value={formData.shortDesc || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shortDesc: e.target.value
              }))
            }
            rows={3} />
          

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                Social Media Links
              </h4>
              <Button type="button" variant="outline" size="sm" onClick={addSocialField}>
                <Plus className="w-4 h-4 mr-2" />
                Add social
              </Button>
            </div>
            <div className="space-y-3">
              {socialFields.map((field) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <select
                      value={field.platform}
                      onChange={(e) => handlePlatformChange(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Select platform</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="x">X</option>
                      <option value="github">GitHub</option>
                      <option value="youtube">YouTube</option>
                      <option value="website">Website</option>
                    </select>
                    {field.platform ? (
                      <Input
                        icon={field.platform === 'linkedin' ? <Linkedin className="w-4 h-4" /> : field.platform === 'facebook' ? <Facebook className="w-4 h-4" /> : field.platform === 'instagram' ? <Instagram className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        placeholder={`${field.platform.charAt(0).toUpperCase() + field.platform.slice(1)} URL`}
                        value={field.url}
                        onChange={(e) => handleSocialChange(field.id, e.target.value)}
                      />
                    ) : null}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSocialField(field.id)} className="mt-0.5 text-rose-600 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Member</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title={`Email ${emailMember?.name ?? 'member'}`}
        size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter subject" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={5}
              placeholder="Write your message" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
            <input
              type="file"
              onChange={(event) => setEmailAttachment(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={emailSending}>
              {emailSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Board Member"
        message="Are you sure you want to remove this board member? This action cannot be undone." />
      
    </div>);

}