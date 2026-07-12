export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
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
