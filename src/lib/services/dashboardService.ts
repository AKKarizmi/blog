import { api } from '../api/client';

export interface DashboardStats {
  total_users: number;
  total_applications: number;
  total_events: number;
  active_volunteers: number;
}

export interface RecentApplication {
  id: number;
  applicant_name: string;
  program_name: string;
  status: string;
  created_at: string;
}

export interface DashboardEvent {
  id: number;
  title: string;
  event_date: string;
  location?: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const toString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return '';
};

const extractArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  const candidates = ['results', 'data', 'items', 'applications', 'events'];
  for (const key of candidates) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const tryGetPayload = async (paths: string[]): Promise<unknown> => {
  for (const path of paths) {
    try {
      return await api.get<unknown>(path);
    } catch {
      // Try the next candidate path.
    }
  }

  return null;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const payload = await tryGetPayload(['/dashboard/', '/dashboard']);
  const record = asRecord(payload) ?? asRecord(asRecord(payload)?.data) ?? {};

  return {
    total_users: toNumber(
      record.total_users ??
        record.totalUsers ??
        record.users ??
        record.user_count ??
        record.userCount
    ),
    total_applications: toNumber(
      record.total_applications ??
        record.totalApplications ??
        record.applications ??
        record.application_count ??
        record.applicationCount
    ),
    total_events: toNumber(
      record.total_events ?? record.totalEvents ?? record.events ?? record.event_count ?? record.eventCount
    ),
    active_volunteers: toNumber(
      record.active_volunteers ??
        record.activeVolunteers ??
        record.volunteers ??
        record.active_volunteer_count ??
        record.activeVolunteerCount
    ),
  };
};

export const fetchRecentApplications = async (limit = 3): Promise<RecentApplication[]> => {
  const payload = await tryGetPayload([
    '/applications/recent?limit=5',
    '/applications/recent/?limit=5',
    '/applications',
    '/applications/',
    '/applicants/',
  ]);
  const items = extractArray(payload);

  return items.slice(0, limit).map((item, index) => {
    const record = asRecord(item) ?? {};
    return {
      id: toNumber(record.id ?? record.application_id ?? index + 1),
      applicant_name: toString(record.applicant_name ?? record.name ?? record.full_name ?? 'Applicant'),
      program_name: toString(record.program_name ?? record.program ?? record.service ?? 'Volunteer Program'),
      status: toString(record.status ?? 'Pending').toUpperCase(),
      created_at: toString(record.created_at ?? record.createdAt ?? record.date ?? ''),
    };
  });
};

export const fetchUpcomingEvents = async (limit = 3): Promise<DashboardEvent[]> => {
  const payload = await tryGetPayload(['/events/', '/events']);
  const items = extractArray(payload);
  const now = new Date();

  return items
    .map((item) => {
      const record = asRecord(item) ?? {};
      const rawDate = toString(record.event_date ?? record.date ?? record.start_date ?? record.startDate ?? '');
      const time = rawDate ? new Date(rawDate) : null;
      const isUpcoming = !time || Number.isNaN(time.getTime()) || time >= now;

      return {
        id: toNumber(record.id ?? record.event_id ?? 0),
        title: toString(record.title ?? record.name ?? 'Untitled event'),
        event_date: rawDate || 'TBD',
        location: toString(record.location ?? record.venue ?? ''),
        ...(isUpcoming ? {} : { _hidden: true }),
      } as DashboardEvent & { _hidden?: boolean };
    })
    .filter((item) => !item._hidden)
    .slice(0, limit)
    .map(({ _hidden, ...event }) => event);
};
