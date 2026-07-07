export type ApiRecord = Record<string, unknown>;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const withLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`;

export const API_ORIGIN = trimTrailingSlash(
  // import.meta.env.VITE_API_ORIGIN || 'https://foroz.me'
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

export const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const fetchFirstJson = async (paths: string[]) => {
  let lastError: unknown;

  for (const path of paths) {
    try {
      return await fetchJson<unknown>(path);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    console.warn(`Unable to fetch ${paths.join(' or ')}`, lastError);
  }

  return null;
};

export const postJson = async <T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T | null> => {
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json() as Promise<T>;
};

export const extractArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const arrayKeys = [
    'results',
    'data',
    'items',
    'events',
    'collaborations',
    'announcements',
    'members',
    'experts',
    'services',
    'programs',
    'values',
    'core_values',
    'stats',
    'impact',
  ];

  for (const key of arrayKeys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  const firstArray = Object.values(payload).find(Array.isArray);
  return firstArray ? (firstArray as T[]) : [];
};

export const extractRecord = (payload: unknown): ApiRecord | undefined => {
  if (!isRecord(payload)) {
    return undefined;
  }

  const nestedKeys = ['data', 'content', 'siteContent', 'site_content', 'result'];
  for (const key of nestedKeys) {
    const value = payload[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return payload;
};

export const pickRecord = (
  source: ApiRecord | undefined,
  keys: string[]
): ApiRecord | undefined => {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
};

export const pickString = (
  source: ApiRecord | undefined,
  keys: string[]
): string | undefined => {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }

  return undefined;
};

export const pickNumber = (
  source: ApiRecord | undefined,
  keys: string[]
): number | undefined => {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
};

export const pickArray = <T>(
  source: ApiRecord | undefined,
  keys: string[]
): T[] | undefined => {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return undefined;
};

export const pickStringArray = (
  source: ApiRecord | undefined,
  keys: string[]
): string[] | undefined => {
  const values = pickArray<unknown>(source, keys);
  if (!values) {
    return undefined;
  }

  const strings = values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);

  return strings.length > 0 ? strings : undefined;
};

export const resolveAssetUrl = (value: string | undefined) => {
  if (!value) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  return value.startsWith('/')
    ? `${API_ORIGIN}${value}`
    : `${API_ORIGIN}/${value}`;
};
