import { api } from '../api/client';

export interface Email {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  is_read: boolean;
  has_attachments: boolean;
  created_at: string;
}

export const emailService = {
  getAll: async (): Promise<Email[]> => {
    const response = await api.get<unknown>('/email/');
    const data = response as { results?: Email[] } | Email[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Email> => {
    return api.get<Email>(`/email/${id}/`);
  },

  send: async (data: Omit<Email, 'id' | 'created_at' | 'is_read'>): Promise<Email> => {
    return api.post<Email>('/email/', data);
  },

  markAsRead: async (id: number): Promise<Email> => {
    return api.patch<Email>(`/email/${id}/`, { is_read: true });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/email/${id}/`);
  },
};
