/** Only explicit web URLs and local paths are navigable content links. */
export function safeLink(value: string | undefined): string | undefined {
  const url = value?.trim();
  if (!url || url === '#' || /[\\\s]/.test(url) || Array.from(url).some(char => char.charCodeAt(0) < 32)) return undefined;
  if (url === '/volunteer_form/' || url === '/volunteer_form') return 'https://volunteer.foroz.me/';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (/^#[a-z][\w-]*$/i.test(url)) return `/${url}`;
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : undefined;
  } catch { return undefined; }
}
export const isExternal = (url: string) => /^https?:/i.test(url);
