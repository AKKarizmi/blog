import type { Notification } from '../types/Notification';

export const mockNotifications: Notification[] = [
{
  id: 'ntf_1',
  type: 'application',
  title: 'New volunteer application',
  message: 'Sarah Johnson submitted an application for Coordinator role.',
  read: false,
  timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  link: '/applications'
},
{
  id: 'ntf_2',
  type: 'message',
  title: 'New message from Marcus Chen',
  message: 'Hi, I wanted to follow up on the driver position...',
  read: false,
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  link: '/messages'
},
{
  id: 'ntf_3',
  type: 'email',
  title: 'Email from board chair',
  message: 'Quarterly review scheduled for next Monday.',
  read: false,
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  link: '/email'
},
{
  id: 'ntf_4',
  type: 'system',
  title: 'Backup completed',
  message: 'Weekly system backup completed successfully.',
  read: true,
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
},
{
  id: 'ntf_5',
  type: 'application',
  title: 'Application approved',
  message: 'Emily Rodriguez was approved for Mentor role.',
  read: true,
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  link: '/applications'
}];