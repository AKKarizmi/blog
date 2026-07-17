import { API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { Event } from '../types/Event';

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['results', 'items', 'data', 'events', 'records'];

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

function unwrapEventPayload(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const nested = record.event ?? record.data ?? record.result ?? record.item ?? record.record;

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

function normalizeEvent(rawItem: Record<string, unknown>): Event {
  const imageValue = typeof rawItem.image === 'string'
    ? rawItem.image
    : typeof rawItem.image_url === 'string'
      ? rawItem.image_url
      : '';

  return {
    id: String(rawItem.id ?? rawItem.event_id ?? rawItem.pk ?? ''),
    title: typeof rawItem.title === 'string' ? rawItem.title : '',
    shortDesc:
      typeof rawItem.shortDesc === 'string'
        ? rawItem.shortDesc
        : typeof rawItem.short_description === 'string'
          ? rawItem.short_description
          : typeof rawItem.description === 'string'
            ? rawItem.description
            : '',
    fullDesc:
      typeof rawItem.fullDesc === 'string'
        ? rawItem.fullDesc
        : typeof rawItem.full_description === 'string'
          ? rawItem.full_description
          : typeof rawItem.description === 'string'
            ? rawItem.description
            : '',
    image: resolveAssetUrl(imageValue),
    publishDate:
      typeof rawItem.publishDate === 'string'
        ? rawItem.publishDate
        : typeof rawItem.publish_date === 'string'
          ? rawItem.publish_date
          : typeof rawItem.date === 'string'
            ? rawItem.date
          : '',
    terminationDate:
      typeof rawItem.terminationDate === 'string'
        ? rawItem.terminationDate
        : typeof rawItem.termination_date === 'string'
          ? rawItem.termination_date
          : ''
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

  return response.json() as Promise<T>;
}

export async function getEvents(): Promise<Event[]> {
  const data = await requestJson<unknown>('/d1/get_events/');
  return toArray(data).map((item) => normalizeEvent(item));
}

export async function createEvent(payload: Omit<Event, 'id'> & { imageFile?: File | null }): Promise<Event> {
  const form = new FormData();
  form.append('title', payload.title);
  form.append('short_description', payload.shortDesc);
  form.append('description', payload.fullDesc);
  form.append('date', payload.publishDate);
  form.append('termination_date', payload.terminationDate);

  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }

  const data = await requestJson<unknown>('/d1/create_event/', {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: form
  });

  return normalizeEvent(unwrapEventPayload(data) ?? {});
}

export async function updateEvent(id: string, payload: Partial<Event> & { imageFile?: File | null }): Promise<Event> {
  const form = new FormData();
  if (payload.title !== undefined) form.append('title', payload.title);
  if (payload.shortDesc !== undefined) form.append('short_description', payload.shortDesc);
  if (payload.fullDesc !== undefined) form.append('description', payload.fullDesc);
  if (payload.publishDate !== undefined) form.append('date', payload.publishDate);
  if (payload.terminationDate !== undefined) form.append('termination_date', payload.terminationDate);

  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }

  const data = await requestJson<unknown>(`/d1/update_event/${id}/`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: form
  });

  return normalizeEvent(unwrapEventPayload(data) ?? {});
}

export async function deleteEvent(id: string): Promise<void> {
  await requestJson<unknown>(`/d1/delete_event/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(true)
  });
}
