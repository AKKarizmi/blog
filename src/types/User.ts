export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'moderator' | 'volunteer';
  status: 'active' | 'suspended';
  createdAt: string;
  avatar?: string;
}