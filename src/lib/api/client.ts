/**
 * FOROZ API Client
 * 
 * Security Features:
 * - Access token stored in memory only (never localStorage)
 * - Refresh token stored securely in localStorage
 * - Automatic token refresh on 401 errors
 * - CSRF token handling for mutations
 */

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const withLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`;

// Configuration from environment
export const API_ORIGIN = trimTrailingSlash(
  import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || '/api'
);

export const buildApiUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${API_ORIGIN}${API_BASE_URL}${withLeadingSlash(path)}`;
};

// Token storage (access token in memory only)
let accessToken: string | null = null;

const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('rtoken');
  } catch {
    return null;
  }
};

const setRefreshToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem('rtoken', token);
    } else {
      localStorage.removeItem('rtoken');
    }
  } catch (error) {
    console.error('Failed to store refresh token:', error);
  }
};

const clearTokens = () => {
  accessToken = null;
  setRefreshToken(null);
};

// CSRF Token handling
const getCsrfToken = (): string | null => {
  const name = 'csrftoken';
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue || null;
};

const ensureCsrfCookie = async () => {
  if (!getCsrfToken()) {
    try {
      await fetch(buildApiUrl('/user/auth/login/'), {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Failed to fetch CSRF cookie:', error);
    }
  }
};

// Token refresh mechanism
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(buildApiUrl('/user/auth/token/refresh/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    accessToken = data.access || null;
    
    // Update refresh token if rotated
    if (data.refresh) {
      setRefreshToken(data.refresh);
    }
    
    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    window.location.href = '/login';
    return null;
  }
};

// Main fetch wrapper
interface ApiRequestInit extends RequestInit {
  _retry?: boolean;
}

export const apiClient = async <T>(
  path: string,
  options: ApiRequestInit = {}
): Promise<T> => {
  const { method = 'GET', headers = {}, _retry = false, ...rest } = options;
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  // Build headers
  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    ...headers,
  };

  // Add auth header if access token exists
  if (accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  // Add CSRF header for mutations
  if (isMutation) {
    await ensureCsrfCookie();
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken;
    }
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
    ...rest,
  };

  // Add body for mutations
  if (isMutation && options.body) {
    if (!(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
      // Remove Content-Type header for FormData to let browser set it with boundary
      delete (requestHeaders as Record<string, string>)['Content-Type'];
    }
  }

  try {
    const response = await fetch(buildApiUrl(path), config);

    // Handle 401 Unauthorized
    if (response.status === 401 && !_retry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry the original request with new token
        return apiClient<T>(path, { ...options, _retry: true });
      }
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `${response.status} ${response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    
    return {} as T;
  } catch (error) {
    console.error(`API Error (${method} ${path}):`, error);
    throw error;
  }
};

// Convenience methods
export const api = {
  get: <T>(path: string) => apiClient<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => apiClient<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => apiClient<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => apiClient<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => apiClient<T>(path, { method: 'DELETE' }),
};

// Auth helper methods
export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const logout = () => {
  clearTokens();
  window.location.href = '/login';
};
