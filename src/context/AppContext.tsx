import { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useToast, ToastType } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import type { Profile } from '../types/Profile';
import { API_BASE } from '../config';
import { readJsonResponse } from '../utils/api';

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
  user?: Partial<Profile> & {
    id?: string | number;
    username?: string;
    email?: string;
    role?: unknown;
    fullName?: string;
    avatar?: string;
    image?: string;
    gender?: string | null;
    status?: string;
    createdAt?: string;
  };
  tokens?: LoginTokenPayload;
}

function normalizeRole(value: unknown): Profile['role'] {
  const role = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (role === 'admin') return 'Admin';
  if (role === 'teacher') return 'Teacher';
  if (role === 'student') return 'Student';

  return 'User';
}

function resolveProfileImageUrl(value: string | undefined): string | undefined {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  try {
    return new URL(value, API_BASE).toString();
  } catch {
    return value;
  }
}

function normalizeUserProfile(user: LoginResponsePayload['user'] | null | undefined): Profile | null {
  if (!user) return null;

  return {
    id: Number(user.id ?? 0),
    username: user.username ?? '',
    email: user.email ?? '',
    fullName: user.fullName ?? user.username ?? '',
    role: normalizeRole(user.role),
    gender: user.gender ?? null,
    status: user.status === 'suspended' ? 'suspended' : 'active',
    createdAt: user.createdAt ?? '',
    image: resolveProfileImageUrl(user.image ?? user.avatar) ?? null
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
  /**
   * Decode a JWT token payload (the middle base64url segment).
   * Returns null if the token is malformed.
   */
  const decodeJwt = (token: string): Record<string, unknown> | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  /**
   * Fetch the current user's profile from /user/auth/user/.
   * Falls back to data extracted from the JWT payload if the endpoint fails.
   */
  const fetchCurrentUser = useCallback(async (accessToken: string): Promise<Profile | null> => {
    const payload = decodeJwt(accessToken);
    console.log('[auth] JWT payload ->', payload);

    try {
      const res = await fetch(`${API_BASE}/user/auth/user/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      console.log('[auth] /user/auth/user/ response', res.status, res.headers.get('content-type'));

      if (!res.ok) {
        console.warn('[auth] /user/auth/user/ returned', res.status);
        return null;
      }

      // Guard: only parse if the response is actually JSON.
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.warn('[auth] /user/auth/user/ returned non-JSON content-type:', contentType);
        // Try reading as text for debug logging
        const text = await res.text();
        console.warn('[auth] response body (first 200 chars):', text.substring(0, 200));
        return null;
      }

      const data = await readJsonResponse<unknown>(res);
      return normalizeUserProfile(data as LoginResponsePayload['user']);
    } catch (err) {
      console.error('[auth] failed to fetch current user', err);
      return null;
    }
  }, []);

  // Restore session on mount if tokens exist in localStorage.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        if (mounted) {
          setCurrentUser(null);
          setIsInitializing(false);
        }
        return;
      }

      // Check if token is expired.
      const payload = decodeJwt(accessToken);
      const exp = payload?.exp as number | undefined;
      if (exp && exp * 1000 < Date.now()) {
        console.log('[auth] access token expired, clearing');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (mounted) {
          setCurrentUser(null);
          setIsInitializing(false);
        }
        return;
      }

      console.log('[auth] restoring session from stored token');
      try {
        const user = await fetchCurrentUser(accessToken);
        if (mounted) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('[auth] session restore error', err);
        if (mounted) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setCurrentUser(null);
        }
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        // Use DRF Simple JWT endpoint — CSRF-exempt, no cookie needed.
        const url = `${API_BASE}/api/token/`;
        const body = JSON.stringify({ username, password });
        console.log('[auth] login request ->', url);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        const responseText = await res.text();
        console.log('[auth] login response', res.status, responseText);

        if (!res.ok) {
          let errorMessage = 'Invalid credentials';
          try {
            const errData = JSON.parse(responseText);
            errorMessage = errData?.detail || errData?.message || errorMessage;
          } catch { /* use default */ }
          addToast(errorMessage, 'error');
          return false;
        }

        let tokens: { access?: string; refresh?: string } = {};
        try {
          tokens = JSON.parse(responseText);
        } catch {
          addToast('Unexpected response from server', 'error');
          return false;
        }

        if (!tokens.access) {
          addToast('Login failed — no access token received', 'error');
          return false;
        }

        // Store tokens.
        localStorage.setItem('accessToken', tokens.access);
        if (tokens.refresh) {
          localStorage.setItem('refreshToken', tokens.refresh);
        }

        // Fetch user profile from DRF endpoint (accepts JWT auth).
        const user = await fetchCurrentUser(tokens.access);
        if (user) {
          setCurrentUser(user);
        } else {
          // Fallback: use the username from the login form.
          console.warn('[auth] could not fetch full profile, using username');
          setCurrentUser(normalizeUserProfile({ username }));
        }

        addToast('Successfully logged in', 'success');
        return true;
      } catch (err) {
        console.error('[auth] login error', err);
        addToast('Login failed', 'error');
        return false;
      }
    },
    [addToast, fetchCurrentUser]
  );

  const logout = useCallback(async () => {
    // JWT is stateless — just clear tokens client-side.
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
