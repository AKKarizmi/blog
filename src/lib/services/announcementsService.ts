import { api } from '../api/client';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const announcementsService = {
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get<unknown>(
      '/announcements/'
    );
    const data = response as { results?: Announcement[] } | Announcement[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Announcement> => {
    return api.get<Announcement>(`/announcements/${id}/`);
  },

  create: async (data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<Announcement> => {
    return api.post<Announcement>('/announcements/', data);
  },

  update: async (id: number, data: Partial<Announcement>): Promise<Announcement> => {
    return api.patch<Announcement>(`/announcements/${id}/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/announcements/${id}/`);
  },
};
