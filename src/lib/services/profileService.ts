import { api } from '../api/client';

export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
  bio?: string;
  is_active: boolean;
  date_joined: string;
}

export const profileService = {
  get: async (): Promise<Profile> => {
    return api.get<Profile>('/user/auth/user/');
  },

  update: async (data: Partial<Profile>): Promise<Profile> => {
    return api.patch<Profile>('/user/auth/user/', data);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/user/auth/password/change/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  uploadAvatar: async (file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.patch<Profile>('/user/auth/user/', formData);
  },
};
