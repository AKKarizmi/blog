import { USE_MOCK, API_BASE } from '../config';
import type { Profile } from '../types/Profile';
import { readJsonResponse } from '../utils/api';

export async function updateProfile(
payload: Partial<Profile>)
: Promise<Profile> {
  if (USE_MOCK) return payload as Profile;
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return readJsonResponse<Profile>(res);
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  if (USE_MOCK) {
    // Mock: accept any 8+ char current password except literal "wrong"
    if (payload.currentPassword === 'wrong') {
      throw new Error('Current password is incorrect');
    }
    return;
  }
  const res = await fetch(`${API_BASE}/profile/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to change password');
}
