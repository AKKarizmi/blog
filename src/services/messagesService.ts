import { USE_MOCK, API_BASE } from '../config';
import { mockConversations, mockMessages } from '../data/messages.mock';
import type { Conversation, Message } from '../types/Message';
import { readJsonResponse } from '../utils/api';

export async function getConversations(): Promise<Conversation[]> {
  if (USE_MOCK) return mockConversations;
  const res = await fetch(`${API_BASE}/conversations`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return readJsonResponse<Conversation[]>(res);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (USE_MOCK)
  return mockMessages.filter((m) => m.conversationId === conversationId);
  const res = await fetch(
    `${API_BASE}/conversations/${conversationId}/messages`
  );
  if (!res.ok) throw new Error('Failed to fetch messages');
  return readJsonResponse<Message[]>(res);
}

export async function sendMessage(
payload: Omit<Message, 'id' | 'timestamp'>)
: Promise<Message> {
  if (USE_MOCK)
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...payload
  };
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return readJsonResponse<Message>(res);
}
