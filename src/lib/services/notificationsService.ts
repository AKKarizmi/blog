import { api } from '../api/client';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<unknown>('/notifications/');
    const data = response as { results?: Notification[] } | Notification[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<unknown>('/notifications/unread_count/');
    const data = response as { count?: number };
    return data.count || 0;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    return api.patch<Notification>(`/notifications/${id}/`, { is_read: true });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/mark_all_read/', {});
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}/`);
  },
};
