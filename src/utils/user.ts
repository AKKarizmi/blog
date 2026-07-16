export function getUserInitials(name: string | null | undefined): string {
  if (typeof name !== 'string') {
    return 'U';
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return 'U';
  }

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}
