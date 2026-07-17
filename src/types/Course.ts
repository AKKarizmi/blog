export interface Course {
  id: number;
  name: string;
  description: string;
  subject: string;
  code: string;
  courseCode: string;
  level: string;
  section: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  delivery: string;
  teacher: {
    id: number;
    fullName: string;
    email: string;
  };
  modules: string[];
  thumbnail: string;
}

export interface CourseCategory {
  id?: number;
  title: string;
  description: string;
  icon_text: string;
}

export interface CoursesResponse {
  courses: Course[];
}
