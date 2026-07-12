export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getCSRFToken(): string | null {
  // Django's default cookie name is 'csrftoken'
  return getCookie('csrftoken') || getCookie('csrf_token') || null;
}

export function csrfHeader(): { [k: string]: string } {
  const token = getCSRFToken();
  return token ? { 'X-CSRFToken': token } : {};
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getAuthHeaders(includeCsrf: boolean = false): { [k: string]: string } {
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
