import type { Email } from '../types/Email';

export const mockEmails: Email[] = [
{
  id: 'email_1',
  subject: 'Quarterly Board Meeting',
  body: 'Hi team,\n\nJust a reminder that our quarterly board meeting is scheduled for next Monday at 2pm. Please review the attached agenda before the meeting.\n\nThanks,\nElena',
  from: 'elena.r@volunteerhub.org',
  to: ['admin@volunteerhub.org'],
  attachments: [{ name: 'Q1-Agenda.pdf', size: 245000, url: '#' }],
  status: 'unread',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  folder: 'inbox'
},
{
  id: 'email_2',
  subject: 'New Volunteer Application Review',
  body: 'Hello,\n\nWe have 5 new applications waiting for review. Can you take a look this week?\n\nBest,\nSarah',
  from: 'sarah.j@volunteerhub.org',
  to: ['admin@volunteerhub.org'],
  status: 'unread',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  folder: 'inbox'
},
{
  id: 'email_3',
  subject: 'Partnership opportunity',
  body: 'Dear Admin,\n\nWe would like to discuss a potential partnership with your organization. Please let us know when you are available for a call.\n\nRegards,\nGreen Earth Team',
  from: 'partnerships@greenearth.org',
  to: ['admin@volunteerhub.org'],
  status: 'read',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  folder: 'inbox'
},
{
  id: 'email_4',
  subject: 'Newsletter Subscription Confirmed',
  body: 'Thank you for subscribing to our newsletter!',
  from: 'newsletter@cityorg.com',
  to: ['admin@volunteerhub.org'],
  status: 'read',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  folder: 'inbox'
},
{
  id: 'email_5',
  subject: 'Weekly Update',
  body: "Hi all,\n\nHere is this week's summary of activities and accomplishments.",
  from: 'admin@volunteerhub.org',
  to: ['team@volunteerhub.org'],
  status: 'read',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  folder: 'sent'
},
{
  id: 'email_6',
  subject: 'Re: Partnership opportunity',
  body: 'Hi,\n\nThanks for reaching out. I would be happy to schedule a call next week.',
  from: 'admin@volunteerhub.org',
  to: ['partnerships@greenearth.org'],
  status: 'read',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  folder: 'sent'
},
{
  id: 'email_7',
  subject: 'Volunteer Welcome',
  body: 'Welcome to VolunteerHub!',
  from: 'admin@volunteerhub.org',
  to: ['newvolunteer@email.com'],
  status: 'read',
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  folder: 'sent'
}];