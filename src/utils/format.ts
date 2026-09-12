import { format, isValid, parseISO } from 'date-fns';

const toDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = parseISO(value);
  if (isValid(parsed)) {
    return parsed;
  }

  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
};

/** Human readable date, falling back to the raw API string. */
export const formatDate = (value?: string, pattern = 'MMM d, yyyy') => {
  const date = toDate(value);
  return date ? format(date, pattern) : value || '';
};

/** Split parts for the distinctive event date blocks. */
export const formatDateParts = (value?: string) => {
  const date = toDate(value);

  if (!date) {
    return { day: '', month: value ? value.slice(0, 10) : '', year: '' };
  }

  return {
    day: format(date, 'dd'),
    month: format(date, 'MMM').toUpperCase(),
    year: format(date, 'yyyy')
  };
};

export const formatTime = (value?: string) => {
  const date = toDate(value);
  return date ? format(date, 'h:mm a') : '';
};

export const truncate = (value: string, max = 160) => {
  if (!value) {
    return '';
  }

  const clean = value.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
};

export const splitParagraphs = (value?: string) =>
(value || '').
split(/\n{2,}|\r\n{2,}/).
map((part) => part.trim()).
filter(Boolean);