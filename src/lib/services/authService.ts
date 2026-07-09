import { api, setAccessToken } from '../api/client';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'volunteer' | 'student' | 'partner';
  is_active: boolean;
  date_joined: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/user/auth/login/', credentials);
    if (response.access) {
      setAccessToken(response.access);
      localStorage.setItem('rtoken', response.refresh);
    }
    return response;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse | null> => {
    return api.post<LoginResponse>('/user/auth/register/', data);
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/user/auth/logout/', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('rtoken');
      window.location.href = '/login';
    }
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/user/auth/user/');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.patch<User>('/user/auth/user/', data);
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/user/auth/password/reset/', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/user/auth/password/reset/confirm/', { token, password });
  },
};
