export interface EmailAttachment {
  name: string;
  size: number;
  url: string;
}

export interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  attachments?: EmailAttachment[];
  status: 'read' | 'unread';
  sentAt: string;
  folder: 'inbox' | 'sent';
}