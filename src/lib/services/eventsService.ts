import { api } from '../api/client';

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<unknown>('/events/');
    const data = response as { results?: Event[] } | Event[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Event> => {
    return api.get<Event>(`/events/${id}/`);
  },

  create: async (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    return api.post<Event>('/events/', data);
  },

  update: async (id: number, data: Partial<Event>): Promise<Event> => {
    return api.patch<Event>(`/events/${id}/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}/`);
  },
};
