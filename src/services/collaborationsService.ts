import { API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { Collaboration } from '../types/Collaboration';

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['results', 'items', 'data', 'collaborations', 'records'];

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

function unwrapCollaborationPayload(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const nested = record.collaboration ?? record.data ?? record.result ?? record.item ?? record.record;

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

function normalizeCollaboration(rawItem: Record<string, unknown>): Collaboration {
  const logoValue = [
    rawItem.logo,
    rawItem.logo_url,
    rawItem.image,
    rawItem.image_url,
    rawItem.photo,
    rawItem.logo_path,
    rawItem.image_path
  ].find((value): value is string => typeof value === 'string' && value.trim() !== '');

  return {
    id: String(rawItem.id ?? rawItem.collaboration_id ?? rawItem.pk ?? ''),
    organizationName:
      typeof rawItem.organizationName === 'string'
        ? rawItem.organizationName
        : typeof rawItem.organization_name === 'string'
          ? rawItem.organization_name
          : typeof rawItem.organization === 'string'
            ? rawItem.organization
            : typeof rawItem.title === 'string'
              ? rawItem.title
              : '',
    shortDescription:
      typeof rawItem.shortDescription === 'string'
        ? rawItem.shortDescription
        : typeof rawItem.short_description === 'string'
          ? rawItem.short_description
          : '',
    collaborationText:
      typeof rawItem.collaborationText === 'string'
        ? rawItem.collaborationText
        : typeof rawItem.description === 'string'
          ? rawItem.description
          : typeof rawItem.details === 'string'
            ? rawItem.details
            : '',
    logo: resolveAssetUrl(logoValue ?? ''),
    date: typeof rawItem.date === 'string' ? rawItem.date : '',
    websiteLink: typeof rawItem.websiteLink === 'string' ? rawItem.websiteLink : typeof rawItem.website === 'string' ? rawItem.website : ''
  };
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
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

export async function getCollaborations(): Promise<Collaboration[]> {
  const data = await requestJson<unknown>('/d1/get_collaborations/');
  return toArray(data).map((item) => normalizeCollaboration(item));
}

export async function createCollaboration(payload: Omit<Collaboration, 'id'> & { logoFile?: File | null }): Promise<Collaboration> {
  const form = new FormData();
  form.append('title', payload.organizationName);
  form.append('short_description', payload.shortDescription || '');
  form.append('description', payload.collaborationText);
  form.append('date', payload.date);
  form.append('website', payload.websiteLink ?? '');

  if (payload.logoFile) {
    form.append('image', payload.logoFile);
  }

  const data = await requestJson<unknown>('/d1/create_collaboration/', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(true)
    },
    body: form
  });

  return normalizeCollaboration(unwrapCollaborationPayload(data) ?? {});
}

export async function updateCollaboration(id: string, payload: Partial<Collaboration> & { logoFile?: File | null }): Promise<Collaboration> {
  const form = new FormData();
  if (payload.organizationName !== undefined) form.append('title', payload.organizationName);
  if (payload.shortDescription !== undefined) {
    form.append('short_description', payload.shortDescription);
  }
  if (payload.collaborationText !== undefined) form.append('description', payload.collaborationText);
  if (payload.date !== undefined) form.append('date', payload.date);
  if (payload.websiteLink !== undefined) form.append('website', payload.websiteLink ?? '');

  if (payload.logoFile) {
    form.append('image', payload.logoFile);
  }

  const data = await requestJson<unknown>(`/d1/update_collaboration/${id}/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(true)
    },
    body: form
  });

  return normalizeCollaboration(unwrapCollaborationPayload(data) ?? {});
}

export async function deleteCollaboration(id: string): Promise<void> {
  await requestJson<unknown>(`/d1/delete_collaboration/${id}/`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(true)
    }
  });
}
