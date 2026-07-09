import { api } from '../api/client';

export interface Message {
  id: number;
  sender_name?: string;
  sender_email: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const messagesService = {
  getAll: async (): Promise<Message[]> => {
    const response = await api.get<unknown>('/emails/');
    const data = response as { results?: Message[] } | Message[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  send: async (data: { recipient: string; subject: string; message: string }): Promise<void> => {
    await api.post('/emails/send/', data);
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.post(`/emails/${id}/read/`);
  },

  contact: async (data: { name: string; email: string; message: string }): Promise<void> => {
    await api.post('/contact/', data);
  },
};
