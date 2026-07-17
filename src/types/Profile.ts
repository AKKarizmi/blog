export interface Profile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Teacher' | 'Student' | 'User';
  gender: string | null;
  status: 'active' | 'suspended';
  createdAt: string;
  image: string | null;
}
