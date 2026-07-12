import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useToast, ToastType } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import type { Profile } from '../types/Profile';
import { API_BASE } from '../config';
import { csrfHeader, getAuthHeaders } from '../utils/csrf';

interface LoginNotificationPayload {
  type?: ToastType;
  message: string;
}

interface LoginTokenPayload {
  access?: string;
  refresh?: string;
}

interface LoginResponsePayload {
  success?: boolean;
  message?: string;
  notifications?: LoginNotificationPayload[];
  user?: Partial<Profile> & { id?: string | number; username?: string; email?: string; role?: Profile['role']; fullName?: string; avatar?: string };
  tokens?: LoginTokenPayload;
}

function normalizeUserProfile(user: LoginResponsePayload['user'] | null | undefined): Profile | null {
  if (!user) return null;

  return {
    id: String(user.id ?? ''),
    username: user.username ?? '',
    email: user.email ?? '',
    fullName: user.fullName ?? user.username ?? '',
    avatar: user.avatar,
    role: (user.role ?? 'volunteer') as Profile['role']
  };
}

interface AppContextValue {
  currentUser: Profile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addToast: (message: string, type?: ToastType) => void;
  updateCurrentUser: (patch: Partial<Profile>) => void;
}
const AppContext = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, removeToast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = `${API_BASE}/user/auth/user/`;
      console.log('[auth] fetching current user ->', url);
      try {
        const res = await fetch(url, { 
          credentials: 'include',
          headers: getAuthHeaders(false)
        });
        if (!mounted) return;
        const txt = await res.text();
        console.log('[auth] current user response', res.status, txt);
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user as Profile);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('[auth] current user error', err);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const url = `${API_BASE}/user/auth/login/`;
        const body = JSON.stringify({ username, password });
        console.log('[auth] login request ->', url, body);
        const headers = { 'Content-Type': 'application/json', ...getAuthHeaders(true) };
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body,
          credentials: 'include'
        });
        const responseText = await res.text();
        console.log('[auth] login response', res.status, responseText);

        let data: LoginResponsePayload | null = null;
        if (responseText) {
          try {
            data = JSON.parse(responseText) as LoginResponsePayload;
          } catch {
            data = null;
          }
        }

        if (!res.ok) {
          const errorMessage = data?.message || data?.notifications?.[0]?.message || 'Invalid credentials';
          addToast(errorMessage, 'error');
          return false;
        }

        if (!data?.success) {
          addToast(data?.message || 'Login failed', 'error');
          return false;
        }

        const normalizedUser = normalizeUserProfile(data.user ?? null);
        setCurrentUser(normalizedUser);

        if (data.tokens?.access) {
          localStorage.setItem('accessToken', data.tokens.access);
        }
        if (data.tokens?.refresh) {
          localStorage.setItem('refreshToken', data.tokens.refresh);
        }

        if (data.notifications?.length) {
          data.notifications.forEach((notification) => {
            addToast(notification.message, notification.type ?? 'info');
          });
        }

        addToast(data.message || 'Successfully logged in', 'success');
        return true;
      } catch (err) {
        addToast('Login failed', 'error');
        return false;
      }
    },
    [addToast]
  );

  const logout = useCallback(async () => {
    try {
      const url = `${API_BASE}/user/auth/logout/`;
      // console.log('[auth] logout request ->', url);
      const headers = getAuthHeaders(true);
      const res = await fetch(url, { method: 'POST', credentials: 'include', headers });
      const txt = await res.clone().text();
      // console.log('[auth] logout response', res.status, txt);
    } catch (err) {
      console.error('[auth] logout error', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    addToast('Logged out successfully', 'info');
  }, [addToast]);

  const updateCurrentUser = useCallback((patch: Partial<Profile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...patch };
      return next;
    });
  }, []);
  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isInitializing,
        login,
        logout,
        addToast,
        updateCurrentUser
      }}>
      
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppContext.Provider>);

}
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}