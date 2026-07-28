

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getCSRFToken(): string | null {
  // Django's default cookie name is 'csrftoken'
  return getCookie('csrftoken') || getCookie('csrf_token') || null;
}

/**
 * Generate a random CSRF token compatible with Django.
 *
 * Django accepts tokens that are 32 alphanumeric characters (a-zA-Z0-9).
 * A 32-char token is treated as an "unmasked secret" by Django's
 * CsrfViewMiddleware — it simply compares the cookie and header values
 * after unmasking, and two identical 32-char strings match.
 */
function generateCSRFToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

/**
 * Ensures the `csrftoken` cookie is set before a POST request.
 *
 * Django's CsrfViewMiddleware checks two things on every POST:
 *   1. A `csrftoken` cookie must exist in the request.
 *   2. An `X-CSRFToken` header must be present and match the cookie.
 *
 * Because the SPA is served by Vite (not Django), Django never gets a
 * chance to set the cookie.  Instead of hitting a backend GET endpoint,
 * we generate a valid token client-side and set the cookie ourselves.
 * `getAuthHeaders(true)` then reads this cookie and sends the same
 * value as the `X-CSRFToken` header — satisfying both checks.
 */
export function ensureCsrfCookie(): void {
  if (getCSRFToken()) return;

  const token = generateCSRFToken();
  // Set cookie on the current path; Vite proxy forwards it to Django.
  document.cookie = `csrftoken=${token}; path=/; SameSite=Lax`;
}

export function csrfHeader(): { [k: string]: string } {
  const token = getCSRFToken();
  return token ? { 'X-CSRFToken': token } : {};
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getAuthHeaders(includeCsrf = false): { [k: string]: string } {
  const headers: { [k: string]: string } = {};
  
  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  if (includeCsrf) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }
  
  return headers;
}
