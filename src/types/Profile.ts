export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'volunteer';
}