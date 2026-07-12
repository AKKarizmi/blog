import type { Announcement } from '../types/Announcement';

export const mockAnnouncements: Announcement[] = [
{
  id: 'ann_1',
  title: 'Volunteer Orientation Session',
  description:
  'New volunteer orientation will be held next Saturday at our community center. All new sign-ups are encouraged to attend.',
  date: '2025-05-01',
  expirationDate: '2026-06-30',
  postedBy: 'Admin User',
  link: 'https://volunteerhub.org/orientation',
  image:
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400'
},
{
  id: 'ann_2',
  title: 'Summer Drive Begins',
  description:
  'Our annual summer fundraising drive has officially started. Help us reach our $50,000 goal!',
  date: '2025-05-10',
  expirationDate: '2026-08-31',
  postedBy: 'Sarah Johnson',
  image:
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400'
},
{
  id: 'ann_3',
  title: 'Office Closed for Holidays',
  description:
  'Our office will be closed from December 24th through January 2nd for the winter holidays.',
  date: '2024-12-15',
  expirationDate: '2025-01-02',
  postedBy: 'Admin User'
},
{
  id: 'ann_4',
  title: 'New Partnership Announcement',
  description:
  'We are excited to announce our new partnership with City Library to expand our youth literacy programs.',
  date: '2024-11-01',
  expirationDate: '2024-12-31',
  postedBy: 'Marcus Chen',
  link: 'https://citylibrary.org'
}];