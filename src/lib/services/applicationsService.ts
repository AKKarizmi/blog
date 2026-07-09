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
    const response = await api.get<unknown>('/applicants/');
    const data = response as { results?: Application[] } | Application[];
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  },

  getById: async (id: number): Promise<Application> => {
    return api.get<Application>(`/view_applicant/${id}/`);
  },

  updateStatus: async (id: number, status: string): Promise<Application> => {
    return api.post<Application>(`/applicants/${id}/update-status/`, { status });
  },

  sendEmail: async (id: number, subject: string, message: string): Promise<void> => {
    await api.post(`/applicants/${id}/send-email/`, { subject, message });
  },
};
