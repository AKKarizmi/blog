import { USE_MOCK, API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { Course, CourseCategory, CoursesResponse } from '../types/Course';
import { readJsonResponse } from '../utils/api';

let currentMockCourses: Course[] = [
  {
    id: 5,
    name: 'First Test Course',
    description: 'Sample course description',
    subject: 'FTC',
    code: 'FTC1XXX-A',
    courseCode: 'FTC1XXX-A',
    level: '1',
    section: 'A',
    published: true,
    publishedAt: null,
    createdAt: '2026-07-07T09:43:04.488340+00:00',
    expiresAt: null,
    delivery: 'self_paced',
    teacher: { id: 7, fullName: 'Teacher-1', email: 'teacher1@test.com' },
    modules: ['New module', 'test', 'as'],
    thumbnail: '/media/Courses/teacher-1/ftc1xxx-a/20260530_101830.jpg'
  }
];

let currentMockCategories: CourseCategory[] = [
  { id: 1, title: 'Technology', description: 'Tech-related courses', icon_text: 'cpu' },
  { id: 2, title: 'Business', description: 'Business and management', icon_text: 'briefcase' }
];

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(true),
      ...(options?.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return readJsonResponse<T>(response);
}

export async function getCourses(): Promise<Course[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...currentMockCourses]), 500);
    });
  }

  const data = await requestJson<CoursesResponse>('/d1/courses/');
  return data.courses || [];
}

export interface CreateCoursePayload {
  name: string;
  description: string;
  subject: string;
  code: string;
  courseCode: string;
  level: string;
  section: string;
  published: boolean;
  delivery: string;
  modules: string[];
  thumbnailFile?: File | null;
}

export async function createCourse(payload: CreateCoursePayload & { thumbnailFile?: File | null }): Promise<Course> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCourse: Course = {
          id: Date.now(),
          name: payload.name,
          description: payload.description,
          subject: payload.subject,
          code: payload.code,
          courseCode: payload.courseCode,
          level: payload.level,
          section: payload.section,
          published: payload.published,
          publishedAt: null,
          createdAt: new Date().toISOString(),
          expiresAt: null,
          delivery: payload.delivery,
          teacher: { id: 0, fullName: 'Unknown', email: '' },
          modules: payload.modules,
          thumbnail: payload.thumbnailFile ? URL.createObjectURL(payload.thumbnailFile) : ''
        };
        currentMockCourses.push(newCourse);
        resolve(newCourse);
      }, 800);
    });
  }

  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('subject', payload.subject);
  form.append('code', payload.code);
  form.append('courseCode', payload.courseCode);
  form.append('level', payload.level);
  form.append('section', payload.section);
  form.append('published', String(payload.published));
  form.append('delivery', payload.delivery);
  form.append('modules', JSON.stringify(payload.modules));
  if (payload.thumbnailFile) {
    form.append('thumbnail', payload.thumbnailFile);
  }

  return requestJson<Course>('/d1/create_course/', {
    method: 'POST',
    body: form
  });
}

export async function updateCourse(id: number, payload: Partial<CreateCoursePayload> & { thumbnailFile?: File | null }): Promise<Course> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = currentMockCourses.findIndex((c) => c.id === id);
        if (index !== -1) {
          currentMockCourses[index] = {
            ...currentMockCourses[index],
            ...payload,
            thumbnail: payload.thumbnailFile ? URL.createObjectURL(payload.thumbnailFile) : currentMockCourses[index].thumbnail
          };
          resolve(currentMockCourses[index]);
        } else {
          throw new Error('Course not found');
        }
      }, 800);
    });
  }

  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && key !== 'thumbnailFile') {
      form.append(key, value instanceof Array ? JSON.stringify(value) : String(value));
    }
  });
  if (payload.thumbnailFile) {
    form.append('thumbnail', payload.thumbnailFile);
  }

  return requestJson<Course>(`/d1/courses/update_course/${id}/`, {
    method: 'POST',
    body: form
  });
}

export async function deleteCourse(id: number): Promise<void> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentMockCourses = currentMockCourses.filter((c) => c.id !== id);
        resolve();
      }, 500);
    });
  }

  // TODO: Confirm DELETE vs POST method against actual backend
  await requestJson<void>(`/d1/courses/delete_course/${id}/`, {
    method: 'POST'
  });
}

// Categories - TODO: endpoints not yet defined
export async function getCourseCategories(): Promise<CourseCategory[]> {
  if (USE_MOCK) return [...currentMockCategories];
  const data = await requestJson<unknown>('/d1/courses/categories/');
  return Array.isArray(data) ? data as CourseCategory[] : [];
}

export async function createCourseCategory(category: Omit<CourseCategory, 'id'>): Promise<CourseCategory> {
  if (!USE_MOCK) {
    return requestJson<CourseCategory>('/d1/courses/create_category/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCategory: CourseCategory = { id: Date.now(), ...category };
      currentMockCategories.push(newCategory);
      resolve(newCategory);
    }, 500);
  });
}

export async function updateCourseCategory(id: number, category: Partial<CourseCategory>): Promise<CourseCategory> {
  if (!USE_MOCK) {
    return requestJson<CourseCategory>(`/d1/courses/update_category/${id}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = currentMockCategories.findIndex((c) => c.id === id);
      if (index !== -1) {
        currentMockCategories[index] = { ...currentMockCategories[index], ...category };
        resolve(currentMockCategories[index]);
      } else {
        throw new Error('Category not found');
      }
    }, 500);
  });
}

export async function deleteCourseCategory(id: number): Promise<void> {
  if (!USE_MOCK) {
    await requestJson<void>(`/d1/courses/delete_category/${id}/`, { method: 'DELETE' });
    return;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      currentMockCategories = currentMockCategories.filter((c) => c.id !== id);
      resolve();
    }, 500);
  });
}
