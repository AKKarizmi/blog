import { ComponentType, useEffect, useState } from 'react';
import { Briefcase, Calendar, Clock3, FileText, GraduationCap, Hash, Mail, MapPin, Phone, Sparkles, Users as UsersIcon } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate } from '../utils/date';
import type { VolunteerApplication } from '../services/applicationsService';

interface Props {
  application: VolunteerApplication | null;
  onClose: () => void;
  onStatusChange?: (status: VolunteerApplication['status']) => Promise<void> | void;
  onDelete?: () => void;
  isUpdating?: boolean;
}

function getStatusVariant(status: VolunteerApplication['status']) {
  switch (status) {
    case 'Approved':
      return 'success' as const;
    case 'Pending':
      return 'warning' as const;
    case 'Rejected':
      return 'danger' as const;
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name: string) {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700'
  ];

  return colors[Math.abs(name.length) % colors.length];
}

function getDocumentPreviewType(url: string) {
  const normalized = url.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(normalized)) {
    return 'image' as const;
  }

  if (/\.pdf(\?.*)?$/i.test(normalized) || normalized.includes('/pdf')) {
    return 'pdf' as const;
  }

  return 'file' as const;
}

export function ApplicationDetailModal({ application, onClose, onStatusChange, onDelete, isUpdating = false }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<VolunteerApplication['status']>('Pending');

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
    }
  }, [application]);

  if (!application) return null;

  return (
    <Modal isOpen={application !== null} onClose={onClose} title="Volunteer Application" size="xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
              {application.photoUrl ? (
                <img src={application.photoUrl} alt={application.name} className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full rounded-full flex items-center justify-center text-lg font-bold ${getColor(application.name)}`}>
                  {getInitials(application.name || 'Applicant')}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900">{application.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
                <span className="text-xs text-gray-500 font-mono">{application.id}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-gray-600" htmlFor="application-status">
              Status
            </label>
            <select
              id="application-status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as VolunteerApplication['status'])}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange?.(selectedStatus)}
              disabled={isUpdating || selectedStatus === application.status}
            >
              {isUpdating ? 'Saving...' : 'Save Status'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          <DetailRow icon={Hash} label="Application ID" value={application.id} mono />
          <DetailRow icon={Calendar} label="Submitted" value={formatDate(application.date)} />
          <DetailRow icon={Mail} label="Email" value={application.email} />
          <DetailRow icon={Phone} label="Phone" value={application.phone} />
          {application.address ? <DetailRow icon={MapPin} label="Address" value={application.address} /> : null}
          {application.availability ? <DetailRow icon={Clock3} label="Availability" value={application.availability} /> : null}
        </div>

        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700">Requested Roles</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {application.roles.map((role) => (
              <Badge key={role} variant="neutral" className="bg-gray-100 text-gray-700 border border-gray-200">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {application.motivation || application.experience || application.education ? (
          <div className="border-t border-gray-100 pt-5 space-y-4">
            {application.motivation ? <InfoSection icon={Sparkles} title="Motivation" text={application.motivation} /> : null}
            {application.experience ? <InfoSection icon={Briefcase} title="Experience" text={application.experience} /> : null}
            {application.education ? <InfoSection icon={GraduationCap} title="Education" text={application.education} /> : null}
          </div>
        ) : null}

        {application.skills && application.skills.length > 0 ? (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-700">Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill) => (
                <Badge key={skill} variant="neutral" className="bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {application.documents && application.documents.length > 0 ? (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-700">Documents</h4>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {application.documents.map((document) => {
                const previewType = getDocumentPreviewType(document.url);

                return (
                  <div key={`${document.name}-${document.url}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-gray-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{document.name || 'Uploaded document'}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline">
                            Open file
                          </a>
                          {previewType === 'pdf' ? (
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                              PDF
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {previewType === 'image' ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        <img src={document.url} alt={document.name} className="h-48 w-full object-cover" />
                      </div>
                    ) : previewType === 'pdf' ? (
                      <div className="mt-4 flex h-36 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                        <div className="text-center">
                          <FileText className="inline h-8 w-8 text-indigo-500" />
                          <p className="mt-2 text-sm text-gray-500">PDF preview unavailable</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {application.notes ? (
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.notes}</p>
          </div>
        ) : null}

        <div className="pt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function DetailRow({ icon: Icon, label, value, mono }: { icon: ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={`text-sm text-gray-900 mt-0.5 break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoSection({ icon: Icon, title, text }: { icon: ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{text}</p>
    </div>
  );
}