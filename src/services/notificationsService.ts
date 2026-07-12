import { USE_MOCK, API_BASE } from '../config';
import { mockNotifications } from '../data/notifications.mock';
import type { Notification } from '../types/Notification';

export async function getNotifications(): Promise<Notification[]> {
  if (USE_MOCK) return mockNotifications;
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
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