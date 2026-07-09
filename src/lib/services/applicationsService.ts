import { api } from '../api/client';

export interface Application {
  id: number;
  applicant_name: string;
  applicant_email: string;
  program_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const applicationsService = {
  getAll: async (): Promise<Application[]> => {
    const response = await api.get<unknown>('/applications/');
    const data = response as { results?: Application[] } | Application[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Application> => {
    return api.get<Application>(`/applications/${id}/`);
  },

  create: async (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> => {
    return api.post<Application>('/applications/', data);
  },

  update: async (id: number, data: Partial<Application>): Promise<Application> => {
    return api.patch<Application>(`/applications/${id}/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/applications/${id}/`);
  },
};
