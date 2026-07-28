import { API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { Announcement } from '../types/Announcement';
import { readJsonResponse } from '../utils/api';

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['results', 'items', 'data', 'announcements', 'records'];

    for (const key of candidateKeys) {
      const nested = record[key];
      if (Array.isArray(nested)) {
        return nested.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
      }
    }

    return [record];
  }

  return [];
}

function unwrapAnnouncementPayload(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const nested = record.announcement ?? record.data ?? record.result ?? record.item ?? record.record;

  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  return record;
}

function resolveAssetUrl(value: string): string {
  if (!value) return '';

  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  try {
    return new URL(value, API_BASE).toString();
  } catch {
    return value;
  }
}

function normalizeAnnouncement(rawItem: Record<string, unknown>): Announcement {
  const imageValue = typeof rawItem.image === 'string'
    ? rawItem.image
    : typeof rawItem.image_url === 'string'
      ? rawItem.image_url
      : '';

  return {
    id: String(rawItem.id ?? rawItem.announcement_id ?? rawItem.pk ?? ''),
    title: typeof rawItem.title === 'string' ? rawItem.title : '',
    description:
      typeof rawItem.description === 'string'
        ? rawItem.description
        : typeof rawItem.short_description === 'string'
          ? rawItem.short_description
          : '',
    date:
      typeof rawItem.date === 'string'
        ? rawItem.date
        : typeof rawItem.publish_date === 'string'
          ? rawItem.publish_date
          : '',
    expirationDate:
      typeof rawItem.expirationDate === 'string'
        ? rawItem.expirationDate
        : typeof rawItem.expiration_date === 'string'
          ? rawItem.expiration_date
          : '',
    postedBy:
      typeof rawItem.postedBy === 'string'
        ? rawItem.postedBy
        : typeof rawItem.posted_by === 'string'
          ? rawItem.posted_by
          : '',
    link: typeof rawItem.link === 'string' ? rawItem.link : '',
    image: resolveAssetUrl(imageValue)
  };
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(true),
      ...(options?.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return readJsonResponse<T>(response);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await requestJson<unknown>('/d1/get_announcements/');
  return toArray(data).map((item) => normalizeAnnouncement(item));
}

export async function createAnnouncement(payload: Omit<Announcement, 'id'> & { imageFile?: File | null }): Promise<Announcement> {
  const form = new FormData();
  form.append('title', payload.title);
  form.append('description', payload.description);
  form.append('publish_date', payload.date);
  form.append('expiration_date', payload.expirationDate);
  form.append('posted_by', payload.postedBy);
  form.append('link', payload.link ?? '');

  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }

  const data = await requestJson<unknown>('/d1/create_announcement/', {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: form
  });

  return normalizeAnnouncement(unwrapAnnouncementPayload(data) ?? {});
}

export async function updateAnnouncement(id: string, payload: Partial<Announcement> & { imageFile?: File | null }): Promise<Announcement> {
  const form = new FormData();
  if (payload.title !== undefined) form.append('title', payload.title);
  if (payload.description !== undefined) form.append('description', payload.description);
  if (payload.date !== undefined) form.append('publish_date', payload.date);
  if (payload.expirationDate !== undefined) form.append('expiration_date', payload.expirationDate);
  if (payload.postedBy !== undefined) form.append('posted_by', payload.postedBy);
  if (payload.link !== undefined) form.append('link', payload.link ?? '');

  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }

  const data = await requestJson<unknown>(`/d1/update_announcement/${id}/`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: form
  });

  return normalizeAnnouncement(unwrapAnnouncementPayload(data) ?? {});
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await requestJson<unknown>(`/d1/delete_announcement/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(true)
  });
}
