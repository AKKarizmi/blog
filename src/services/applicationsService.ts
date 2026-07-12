import { API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  notes?: string;
  address?: string;
  motivation?: string;
  experience?: string;
  availability?: string;
  education?: string;
  skills?: string[];
  documents?: Array<{ name: string; url: string }>;
}

function normalizeStatus(rawStatus?: string): VolunteerApplication['status'] {
  const normalized = (rawStatus ?? '').toLowerCase();

  if (normalized === 'approved' || normalized === 'approve') {
    return 'Approved';
  }

  if (normalized === 'rejected' || normalized === 'reject' || normalized === 'denied') {
    return 'Rejected';
  }

  return 'Pending';
}

function normalizeRoles(rawRoles: unknown): string[] {
  if (Array.isArray(rawRoles)) {
    return rawRoles.map((role) => String(role)).filter(Boolean);
  }

  if (typeof rawRoles === 'string') {
    return rawRoles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeDate(rawDate: unknown): string {
  if (typeof rawDate === 'string' && rawDate.trim()) {
    return rawDate;
  }

  return '';
}

function normalizeName(rawItem: Record<string, unknown>): string {
  const directName = typeof rawItem.name === 'string' ? rawItem.name : '';
  const fullName = typeof rawItem.full_name === 'string' ? rawItem.full_name : '';
  const firstName = typeof rawItem.first_name === 'string' ? rawItem.first_name : '';
  const lastName = typeof rawItem.last_name === 'string' ? rawItem.last_name : '';

  if (directName) return directName;
  if (fullName) return fullName;
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  }

  return 'Unknown Applicant';
}

function normalizePhone(rawItem: Record<string, unknown>): string {
  const phone = typeof rawItem.phone === 'string' ? rawItem.phone : '';
  const phoneNumber = typeof rawItem.phone_number === 'string' ? rawItem.phone_number : '';
  const mobile = typeof rawItem.mobile === 'string' ? rawItem.mobile : '';

  return phone || phoneNumber || mobile || '';
}

function normalizeEmail(rawItem: Record<string, unknown>): string {
  return typeof rawItem.email === 'string' ? rawItem.email : '';
}

function normalizeNotes(rawItem: Record<string, unknown>): string | undefined {
  const notes = rawItem.notes;
  return typeof notes === 'string' && notes.trim() ? notes : undefined;
}

function normalizeOptionalText(rawItem: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = rawItem[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function normalizeSkills(rawItem: Record<string, unknown>): string[] | undefined {
  const rawSkills = rawItem.skills ?? rawItem.soft_skills ?? rawItem.skill_set ?? rawItem.technical_skills;

  if (Array.isArray(rawSkills)) {
    const values = rawSkills.map((skill) => String(skill)).filter(Boolean);
    return values.length ? values : undefined;
  }

  if (typeof rawSkills === 'string' && rawSkills.trim()) {
    const values = rawSkills.split(',').map((skill) => skill.trim()).filter(Boolean);
    return values.length ? values : undefined;
  }

  return undefined;
}

function normalizeDocuments(rawItem: Record<string, unknown>): Array<{ name: string; url: string }> | undefined {
  const rawDocuments = rawItem.documents ?? rawItem.files ?? rawItem.attachments;

  if (Array.isArray(rawDocuments)) {
    const documents = rawDocuments
      .map((document) => {
        if (document && typeof document === 'object') {
          const record = document as Record<string, unknown>;
          const name = typeof record.name === 'string' ? record.name : '';
          const url = typeof record.url === 'string' ? record.url : '';
          return name ? { name, url } : null;
        }
        return null;
      })
      .filter((document): document is { name: string; url: string } => Boolean(document));

    return documents.length ? documents : undefined;
  }

  return undefined;
}

function normalizeId(rawItem: Record<string, unknown>): string {
  const candidate = rawItem.id ?? rawItem.applicant_id ?? rawItem.volunteer_id ?? rawItem.pk;
  return candidate == null ? '' : String(candidate);
}

function normalizeApplication(rawItem: Record<string, unknown>): VolunteerApplication {
  return {
    id: normalizeId(rawItem),
    name: normalizeName(rawItem),
    email: normalizeEmail(rawItem),
    phone: normalizePhone(rawItem),
    roles: normalizeRoles(rawItem.roles ?? rawItem.role ?? rawItem.volunteer_role),
    status: normalizeStatus(
      (rawItem.status as string | undefined) ??
        (rawItem.application_status as string | undefined) ??
        (rawItem.volunteer_status as string | undefined)
    ),
    date: normalizeDate(rawItem.created_at ?? rawItem.submitted_at ?? rawItem.date ?? rawItem.created),
    notes: normalizeNotes(rawItem),
    address: normalizeOptionalText(rawItem, ['address', 'location', 'city', 'country']),
    motivation: normalizeOptionalText(rawItem, ['motivation', 'reason', 'why_join', 'why_volunteer']),
    experience: normalizeOptionalText(rawItem, ['experience', 'previous_experience', 'background', 'ngo_experience']),
    availability: normalizeOptionalText(rawItem, ['availability', 'availability_hours', 'preferred_schedule']),
    education: normalizeOptionalText(rawItem, ['education', 'educational_background', 'qualification']),
    skills: normalizeSkills(rawItem),
    documents: normalizeDocuments(rawItem)
  };
}

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['results', 'items', 'data', 'applications', 'applicants', 'volunteers', 'records'];

    for (const key of candidateKeys) {
      const nested = record[key];
      if (Array.isArray(nested)) {
        return nested.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
      }
    }

    if ('applicant' in record || 'volunteer' in record) {
      const nested = record.applicant ?? record.volunteer;
      if (nested && typeof nested === 'object') {
        return [nested as Record<string, unknown>];
      }
    }

    return [record];
  }

  return [];
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...(options?.method && options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeaders(true),
      ...(options?.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getVolunteers(): Promise<VolunteerApplication[]> {
  const data = await requestJson<unknown>(`/d1/get_volunteers/`);
  return toArray(data).map((item) => normalizeApplication(item));
}

export async function viewVolunteer(id: string): Promise<VolunteerApplication> {
  const data = await requestJson<unknown>(`/d1/view_volunteer/${id}/`);
  const [first] = toArray(data);
  return normalizeApplication(first ?? {});
}

export async function updateVolunteerStatus(id: string, status: VolunteerApplication['status']): Promise<VolunteerApplication> {
  const data = await requestJson<unknown>(`/d1/update_volunteer_status/${id}/`, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: JSON.stringify({ status })
  });

  const [first] = toArray(data);
  return normalizeApplication(first ?? {});
}

export async function deleteVolunteer(id: string): Promise<void> {
  await requestJson<unknown>(`/d1/delete_volunteer/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(false)
  });
}

export async function sendEmailToVolunteer(id: string): Promise<void> {
  await requestJson<unknown>(`email_to_volunteer/${id}/send-email/`, {
    method: 'POST'
  });
}
