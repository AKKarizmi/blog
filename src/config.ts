// Set USE_MOCK to true only when VITE_USE_MOCK is explicitly set to 'true'.
// This makes the default behaviour call the real backend APIs.
export const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK === 'true';
export const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000';