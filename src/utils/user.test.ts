import { describe, expect, it } from 'vitest';
import { getUserInitials } from './user';

describe('getUserInitials', () => {
  it('returns initials from a full name', () => {
    expect(getUserInitials('Jane Doe')).toBe('JD');
  });

  it('falls back safely for missing or empty values', () => {
    expect(getUserInitials(undefined)).toBe('U');
    expect(getUserInitials('   ')).toBe('U');
    expect(getUserInitials(null)).toBe('U');
  });

  it('uses the first letter of a single name', () => {
    expect(getUserInitials('Ada')).toBe('A');
  });
});
