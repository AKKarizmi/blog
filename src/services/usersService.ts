import { API_BASE } from '../config';
import type { User } from '../types/User';
import { csrfHeader } from '../utils/csrf';

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/user/users`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(
  payload: Omit<User, 'id' | 'createdAt'>
): Promise<User> {
  const form = new URLSearchParams();
  // append known fields; backend form views typically read POST params
  if (payload.username) form.append('username', payload.username);
  if ((payload as any).password) form.append('password', (payload as any).password);
  if (payload.email) form.append('email', payload.email);
  if (payload.fullName) form.append('fullName', payload.fullName);
  if (payload.role) form.append('role', payload.role);
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', ...csrfHeader() };
  const res = await fetch(`${API_BASE}/user/auth/register/`, {
    method: 'POST',
    headers,
    body: form.toString(),
    credentials: 'include'
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create user: ${txt}`);
  }
  return res.json();
}

export async function updateUser(
  id: string,
  payload: Partial<User>
): Promise<User> {
  const headers = { 'Content-Type': 'application/json', ...csrfHeader() };
  const res = await fetch(`${API_BASE}/user/auth/update_user/${id}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to update user: ${txt}`);
  }
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const headers = { ...csrfHeader() };
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