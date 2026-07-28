import { USE_MOCK, API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { CoreValue } from '../types/CoreValue';
import { readJsonResponse } from '../utils/api';

let currentMockData: CoreValue[] = [
  { id: 1, title: 'Integrity', description: 'We act with honesty and transparency', icon: 'Shield', color: '#1E40AF', order: 0 },
  { id: 2, title: 'Community', description: 'We build strong, inclusive communities', icon: 'Users', color: '#059669', order: 1 }
];

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

export async function getCoreValues(): Promise<CoreValue[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...currentMockData]), 500);
    });
  }

  const data = await requestJson<CoreValue[]>('/core_values/');
  return Array.isArray(data) ? data : [];
}

export async function updateCoreValues(values: CoreValue[]): Promise<CoreValue[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentMockData = values.map((v, i) => ({ ...v, id: v.id ?? i + 1 }));
        resolve([...currentMockData]);
      }, 800);
    });
  }

  return requestJson<CoreValue[]>('/update_core_values/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  });
}
