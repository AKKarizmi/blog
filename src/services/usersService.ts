import { API_BASE } from '../config';
import type { User } from '../types/User';
import { getAuthHeaders, getCSRFToken } from '../utils/csrf';

function normalizeRole(value: unknown): User['role'] {
  const role = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (role === 'admin' || role === 'teacher' || role === 'student' || role === 'user') {
    return role;
  }

  return 'user';
}

function normalizeStatus(value: unknown): User['status'] {
  if (typeof value === 'boolean') {
    return value ? 'active' : 'suspended';
  }

  const status = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (status === 'active' || status === 'suspended') {
    return status;
  }

  return 'active';
}

function resolveImageUrl(value: string): string {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  try {
    return new URL(value, API_BASE).toString();
  } catch {
    return value;
  }
}

function normalizeUser(rawItem: Record<string, unknown>): User {
  return {
    id: String(rawItem.id ?? rawItem.user_id ?? rawItem.pk ?? ''),
    username: typeof rawItem.username === 'string' ? rawItem.username : '',
    email: typeof rawItem.email === 'string' ? rawItem.email : '',
    fullName:
      typeof rawItem.fullName === 'string'
        ? rawItem.fullName
        : typeof rawItem.full_name === 'string'
          ? rawItem.full_name
          : '',
    role: normalizeRole(rawItem.role),
    status: normalizeStatus(rawItem.status),
    createdAt:
      typeof rawItem.createdAt === 'string'
        ? rawItem.createdAt
        : typeof rawItem.created_at === 'string'
          ? rawItem.created_at
          : '',
    image: typeof rawItem.image === 'string' ? resolveImageUrl(rawItem.image) : undefined
  };
}

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['users', 'results', 'items', 'data', 'records'];

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

function unwrapUserPayload(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const nested = record.user ?? record.data ?? record.result ?? record.item ?? record.record;

  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  return record;
}

type UpdateUserPayload = Partial<User> & { imageFile?: File | null };

function toBackendUserForm(payload: UpdateUserPayload): FormData {
  const form = new FormData();
  const csrfToken = getCSRFToken();

  if (csrfToken) form.append('csrfmiddlewaretoken', csrfToken);
  if (payload.username) form.append('username', payload.username);
  if (payload.fullName) form.append('full_name', payload.fullName);
  if (payload.email) form.append('email', payload.email);
  if (payload.status) form.append('status', payload.status);
  if (payload.role) form.append('role', payload.role);
  if (payload.imageFile) form.append('image', payload.imageFile);

  return form;
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/user/users/`, {
    credentials: 'include',
    headers: getAuthHeaders(false)
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return toArray(data).map((item) => normalizeUser(item));
}

export async function createUser(
  payload: Omit<User, 'id' | 'createdAt'> & { password?: string }
): Promise<User> {
  const form = new URLSearchParams();
  // append known fields; backend form views typically read POST params
  if (payload.username) form.append('username', payload.username);
  if (payload.password) form.append('password', payload.password);
  if (payload.email) form.append('email', payload.email);
  if (payload.fullName) form.append('fullName', payload.fullName);
  if (payload.role) form.append('role', payload.role);
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', ...getAuthHeaders(true) };
  const res = await fetch(`${API_BASE}/user/create_user/`, {
    method: 'POST',
    headers,
    body: form.toString(),
    credentials: 'include'
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create user: ${txt}`);
  }
  const data = await res.json();
  return normalizeUser(unwrapUserPayload(data) ?? {});
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<User> {
  const res = await fetch(`${API_BASE}/user/update_user/${id}/`, {
    method: 'POST',
    body: toBackendUserForm(payload),
    credentials: 'include'
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to update user: ${txt}`);
  }
  const data = await res.json();
  return normalizeUser(unwrapUserPayload(data) ?? {});
}

export async function deleteUser(id: string): Promise<void> {
  const headers = getAuthHeaders(true);
  const res = await fetch(`${API_BASE}/user/auth/delete_user/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to delete user: ${txt}`);
  }
}
