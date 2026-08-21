// Set USE_MOCK to true only when VITE_USE_MOCK is explicitly set to 'true'.
// This makes the default behaviour call the real backend APIs.
export const USE_MOCK = import.meta.env?.VITE_USE_MOCK === 'true';
// For development and production, use the deployed backend URL.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://foroz.vercel.app';
