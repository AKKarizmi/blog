// Set USE_MOCK to true only when VITE_USE_MOCK is explicitly set to 'true'.
// This makes the default behaviour call the real backend APIs.
export const USE_MOCK = import.meta.env?.VITE_USE_MOCK === 'true';
// In development, leave API_BASE empty so requests go through Vite's proxy (same-origin).
// For production, set VITE_API_BASE_URL to the real backend URL.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
