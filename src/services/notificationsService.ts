import { USE_MOCK, API_BASE } from '../config';
import { mockNotifications } from '../data/notifications.mock';
import type { Notification } from '../types/Notification';
import { readJsonResponse } from '../utils/api';

export function normalizeNotifications(payload: unknown): Notification[] {
  if (Array.isArray(payload)) {
    return payload as Notification[];
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>;
    if (Array.isArray(candidate.notifications)) {
      return candidate.notifications as Notification[];
    }
    if (Array.isArray(candidate.data)) {
      return candidate.data as Notification[];
    }
  }

  return [];
}

export async function getNotifications(): Promise<Notification[]> {
  if (USE_MOCK) return mockNotifications;
  const res = await fetch(`${API_BASE}/d1/get_notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data = await readJsonResponse<unknown>(res);
  return normalizeNotifications(data);
}

export async function markAsRead(id: string): Promise<void> {
  if (USE_MOCK) return;
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
}

export async function markAllAsRead(): Promise<void> {
  if (USE_MOCK) return;
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to mark all as read');
}
