export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
  image?: string;
}
