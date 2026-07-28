import { USE_MOCK, API_BASE } from '../config';
import { mockEmails } from '../data/emails.mock';
import type { Email } from '../types/Email';
import { readJsonResponse } from '../utils/api';

const STORAGE_KEY = 'email-read-state';

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Request failed with status ${response.status}`;

  try {
    const parsed = JSON.parse(text);

    if (typeof parsed === 'string' && parsed.trim()) {
      return parsed;
    }

    if (parsed && typeof parsed === 'object') {
      const candidates = [
        (parsed as Record<string, unknown>).message,
        (parsed as Record<string, unknown>).error,
        (parsed as Record<string, unknown>).detail,
        (parsed as Record<string, unknown>).non_field_errors
      ];

      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) return candidate;
      }

      if (Array.isArray((parsed as Record<string, unknown>).errors)) {
        const firstError = ((parsed as Record<string, unknown>).errors as unknown[]).find((item) => typeof item === 'string' && item.trim());
        if (typeof firstError === 'string' && firstError.trim()) return firstError;
      }
    }
  } catch {
    // Fall back to the raw response text below.
  }

  return text;
}

function readStoredReadState(): Record<string, 'read'> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, 'read'> : {};
  } catch {
    return {};
  }
}

function writeStoredReadState(state: Record<string, 'read'>) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeReadState(emails: Email[]): Email[] {
  const storedState = readStoredReadState();
  if (!Object.keys(storedState).length) return emails;

  return emails.map((email) => {
    if (storedState[email.id]) {
      return { ...email, status: 'read' };
    }
    return email;
  });
}

function updateStoredReadState(emails: Email[]) {
  const state = readStoredReadState();
  let changed = false;

  for (const email of emails) {
    if (email.status === 'read' && !state[email.id]) {
      state[email.id] = 'read';
      changed = true;
    }
  }

  if (changed) writeStoredReadState(state);
}

function toArray(value: unknown): Email[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Email => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys = ['results', 'items', 'data', 'emails', 'records'];

    for (const key of candidateKeys) {
      const nested = record[key];
      if (Array.isArray(nested)) {
        return nested.filter((item): item is Email => Boolean(item) && typeof item === 'object');
      }
    }

    return [value as Email];
  }

  return [];
}

export async function getEmails(): Promise<Email[]> {
  if (USE_MOCK) return mockEmails;
  const res = await fetch(`${API_BASE}/emails/`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = await readJsonResponse<unknown>(res);
  const emails = toArray(data);
  const merged = mergeReadState(emails);
  updateStoredReadState(merged);
  return merged;
}

export async function markEmailAsRead(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const state = readStoredReadState();
  state[id] = 'read';
  writeStoredReadState(state);
}

export async function sendEmail(
payload: Omit<Email, 'id' | 'sentAt' | 'status' | 'folder'> & { files?: File[] })
: Promise<Email> {
  if (USE_MOCK) {
    return {
      id: crypto.randomUUID(),
      sentAt: new Date().toISOString(),
      status: 'read',
      folder: 'sent',
      ...payload
    };
  }
  const formData = new FormData();
  formData.append('from', payload.from);
  formData.append('to', JSON.stringify(payload.to));
  formData.append('subject', payload.subject);
  formData.append('body', payload.body);

  if (payload.attachments?.length) {
    payload.attachments.forEach((attachment) => {
      formData.append('attachments', attachment as unknown as Blob);
    });
  }

  if (payload.files?.length) {
    payload.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const res = await fetch(`${API_BASE}/email/send/`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return readJsonResponse<Email>(res);
}
