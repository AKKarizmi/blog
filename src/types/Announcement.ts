export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  expirationDate: string;
  postedBy: string;
  link?: string;
  image?: string;
}