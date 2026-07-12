import type { Collaboration } from '../types/Collaboration';

export const mockCollaborations: Collaboration[] = [
{
  id: 'col_1',
  organizationName: 'City Library',
  collaborationText:
  'Partnering to expand youth literacy programs across all branches.',
  logo: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=200',
  date: '2024-09-15',
  websiteLink: 'https://citylibrary.org'
},
{
  id: 'col_2',
  organizationName: 'Green Earth Foundation',
  collaborationText:
  'Joint environmental restoration projects in local parks and waterways.',
  date: '2024-10-22',
  websiteLink: 'https://greenearth.org'
},
{
  id: 'col_3',
  organizationName: 'Community Health Network',
  collaborationText:
  'Free monthly health screenings at our community center.',
  logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200',
  date: '2025-01-10'
},
{
  id: 'col_4',
  organizationName: 'Riverside School District',
  collaborationText:
  'Volunteer tutors providing after-school support to K-12 students.',
  date: '2025-02-05',
  websiteLink: 'https://riversideschools.edu'
}];