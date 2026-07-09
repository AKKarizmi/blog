import { api } from '../api/client';

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const messagesService = {
  getAll: async (): Promise<Message[]> => {
    const response = await api.get<unknown>('/messages/');
    const data = response as { results?: Message[] } | Message[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Message> => {
    return api.get<Message>(`/messages/${id}/`);
  },

  create: async (data: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
    return api.post<Message>('/messages/', data);
  },

  markAsRead: async (id: number): Promise<Message> => {
    return api.patch<Message>(`/messages/${id}/`, { is_read: true });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/messages/${id}/`);
  },
};
