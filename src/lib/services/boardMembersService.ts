import { api } from '../api/client';

export interface BoardMember {
  id: number;
  name: string;
  role: string;
  description?: string;
  photo?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const boardMembersService = {
  getAll: async (): Promise<BoardMember[]> => {
    const response = await api.get<unknown>('/board-members/');
    const data = response as { results?: BoardMember[] } | BoardMember[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<BoardMember> => {
    return api.get<BoardMember>(`/board-members/${id}/`);
  },

  create: async (data: Omit<BoardMember, 'id' | 'created_at' | 'updated_at'>): Promise<BoardMember> => {
    return api.post<BoardMember>('/board-members/create_member/', data);
  },

  update: async (id: number, data: Partial<BoardMember>): Promise<BoardMember> => {
    return api.post<BoardMember>(`/board-members/${id}/update_member/`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.post(`/board-members/${id}/delete_member/`);
  },

  sendEmail: async (id: number, subject: string, message: string): Promise<void> => {
    await api.post(`/board-members/${id}/send_email/`, { subject, message });
  },
};
