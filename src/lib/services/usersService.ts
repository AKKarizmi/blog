import { api } from '../api/client';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'volunteer' | 'student' | 'partner';
  is_active: boolean;
  date_joined: string;
}

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<unknown>('/users/');
    const data = response as { results?: User[] } | User[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<User> => {
    return api.get<User>(`/users/${id}/`);
  },

  create: async (data: Omit<User, 'id' | 'date_joined'>): Promise<User> => {
    return api.post<User>('/users/', data);
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    return api.patch<User>(`/users/${id}/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/`);
  },
};
