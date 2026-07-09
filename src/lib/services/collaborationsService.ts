import { api } from '../api/client';

export interface Collaboration {
  id: number;
  partner_name: string;
  description: string;
  logo?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const collaborationsService = {
  getAll: async (): Promise<Collaboration[]> => {
    const response = await api.get<unknown>('/collaborations/');
    const data = response as { results?: Collaboration[] } | Collaboration[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Collaboration> => {
    return api.get<Collaboration>(`/collaborations/${id}/`);
  },

  create: async (data: Omit<Collaboration, 'id' | 'created_at' | 'updated_at'>): Promise<Collaboration> => {
    return api.post<Collaboration>('/collaborations/create_collaboration/', data);
  },

  update: async (id: number, data: Partial<Collaboration>): Promise<Collaboration> => {
    return api.post<Collaboration>(`/collaborations/${id}/update_collaboration/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.post(`/collaborations/${id}/delete_collaboration/`);
  },
};
