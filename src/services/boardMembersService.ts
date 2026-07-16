import { API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  shortDesc: string;
  photo: string;
  socials: Record<string, string | undefined>;
  roles?: string[];
}

function normalizeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function normalizeSocialEntry(value: unknown): [string, string | undefined] | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      return normalizeSocialEntry(JSON.parse(trimmed));
    } catch {
      return null;
    }
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const platform = typeof record.platform === 'string'
    ? record.platform.trim()
    : typeof record.name === 'string'
      ? record.name.trim()
      : '';
  const url = typeof record.url === 'string'
    ? normalizeUrl(record.url)
    : typeof record.href === 'string'
      ? normalizeUrl(record.href)
      : undefined;

  if (!platform || !url) {
    return null;
  }

  return [platform, url];
}

function normalizeSocials(rawSocials: unknown): BoardMember['socials'] {
  if (!rawSocials) {
    return {};
  }

  if (Array.isArray(rawSocials)) {
    const normalized: Record<string, string | undefined> = {};
    for (const item of rawSocials) {
      const normalizedEntry = normalizeSocialEntry(item);
      if (normalizedEntry) {
        const [platform, url] = normalizedEntry;
        if (url) {
          normalized[platform] = url;
        }
      }
    }
    return normalized;
  }

  if (typeof rawSocials === 'object') {
    const record = rawSocials as Record<string, unknown>;
    const normalized: Record<string, string | undefined> = {};

    for (const [key, value] of Object.entries(record)) {
      const normalizedValue = normalizeUrl(value);
      if (normalizedValue) {
        normalized[key] = normalizedValue;
      }
    }

    return normalized;
  }

  return {};
}

export function normalizeBoardMember(rawItem: Record<string, unknown>): BoardMember {
  const roleValue =
    typeof rawItem.role === 'string'
      ? rawItem.role
      : Array.isArray(rawItem.roles)
        ? rawItem.roles.filter((item): item is string => typeof item === 'string').join(', ')
        : '';
  const imageValue =
    typeof rawItem.photo === 'string'
      ? rawItem.photo
      : typeof rawItem.image === 'string'
        ? rawItem.image
        : typeof rawItem.image_url === 'string'
          ? rawItem.image_url
          : '';

  return {
    id: String(rawItem.id ?? rawItem.member_id ?? rawItem.pk ?? ''),
    name:
      typeof rawItem.name === 'string'
        ? rawItem.name
        : typeof rawItem.title === 'string'
          ? rawItem.title
          : typeof rawItem.full_name === 'string'
            ? rawItem.full_name
            : '',
    role: roleValue,
    email: typeof rawItem.email === 'string' ? rawItem.email : '',
    shortDesc:
      typeof rawItem.shortDesc === 'string'
        ? rawItem.shortDesc
        : typeof rawItem.short_desc === 'string'
          ? rawItem.short_desc
          : typeof rawItem.short_description === 'string'
            ? rawItem.short_description
            : typeof rawItem.description === 'string'
              ? rawItem.description
              : '',
    photo: imageValue,
    socials: normalizeSocials(
      rawItem.socials ?? rawItem.social_links ?? rawItem.socials_links ?? rawItem.social
    )
  };
}

export function unwrapBoardMemberPayload(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const candidateKeys = ['member', 'result', 'data', 'item', 'record', 'board_member', 'members', 'board_members', 'results', 'items', 'records'];

  for (const key of candidateKeys) {
    const nested = record[key];
    if (Array.isArray(nested) && nested.length > 0) {
      const [first] = nested;
      return first && typeof first === 'object' ? (first as Record<string, unknown>) : null;
    }

    if (nested && typeof nested === 'object') {
      return nested as Record<string, unknown>;
    }
  }

  return record;
}

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  const unwrapped = unwrapBoardMemberPayload(value);
  return unwrapped ? [unwrapped] : [];
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(options?.headers ?? {})
    },
    credentials: 'include',
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  const data = await requestJson<unknown>('/d1/get_members/');
  return toArray(data).map((item) => normalizeBoardMember(item));
}

export async function createBoardMember(payload: Omit<BoardMember, 'id'> & { photoFile?: File | null; socialPayload?: Array<Record<string, string>>; roles?: string[] }): Promise<BoardMember> {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('title', payload.name);
  form.append('role', payload.role);
  form.append('email', payload.email ?? '');
  form.append('roles', JSON.stringify(payload.roles ?? []));
  form.append('shortDesc', payload.shortDesc);
  form.append('short_desc', payload.shortDesc);
  form.append('short_description', payload.shortDesc);
  for (const item of payload.socialPayload ?? []) {
    form.append('socials', JSON.stringify(item));
  }

  if (payload.photoFile) {
    form.append('image', payload.photoFile);
    form.append('photo', payload.photoFile);
  } else if (payload.photo) {
    form.append('image', payload.photo);
    form.append('photo', payload.photo);
  }

  const data = await requestJson<unknown>('/d1/create_member/', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(true)
    },
    body: form
  });

  const responsePayload = unwrapBoardMemberPayload(data) ?? {};
  return normalizeBoardMember(responsePayload);
}

export async function updateBoardMember(id: string, payload: Partial<BoardMember> & { photoFile?: File | null; socialPayload?: Array<Record<string, string>>; roles?: string[] }): Promise<BoardMember> {
  const form = new FormData();
  if (payload.name) {
    form.append('name', payload.name);
    form.append('title', payload.name);
  }
  if (payload.role) form.append('role', payload.role);
  form.append('email', payload.email ?? '');
  if (payload.roles) form.append('roles', JSON.stringify(payload.roles));
  if (payload.shortDesc) {
    form.append('shortDesc', payload.shortDesc);
    form.append('short_desc', payload.shortDesc);
    form.append('short_description', payload.shortDesc);
  }
  for (const item of payload.socialPayload ?? []) {
    form.append('socials', JSON.stringify(item));
  }

  if (payload.photoFile) {
    form.append('image', payload.photoFile);
    form.append('photo', payload.photoFile);
  } else if (payload.photo) {
    form.append('image', payload.photo);
    form.append('photo', payload.photo);
  }

  const data = await requestJson<unknown>(`/d1/update_member/${id}/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(true)
    },
    body: form
  });

  const responsePayload = unwrapBoardMemberPayload(data) ?? {};
  return normalizeBoardMember(responsePayload);
}

export async function deleteBoardMember(id: string): Promise<void> {
  await requestJson<unknown>(`/d1/delete_member/${id}/`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(true)
    }
  });
}

export async function sendEmailToBoardMember(_id: string, payload?: { subject?: string; body?: string; attachment?: File | null; recipient?: string; recipientName?: string }): Promise<void> {
  const form = new FormData();
  const recipient = payload?.recipient?.trim() || '';
  const recipientName = payload?.recipientName?.trim() || '';
  const subject = payload?.subject?.trim() || '';
  const body = payload?.body?.trim() || '';

  if (recipient) {
    form.append('to', recipient);
    form.append('recipients', recipient);
  }
  if (recipientName) {
    form.append('recipient_name', recipientName);
    form.append('name', recipientName);
  }
  if (subject) form.append('subject', subject);
  if (body) form.append('body', body);
  if (payload?.attachment) {
    form.append('attachment', payload.attachment);
    form.append('attachments', payload.attachment);
  }

  await requestJson<unknown>(`/email/send/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(true)
    },
    body: form
  });
}
