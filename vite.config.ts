import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  // Browser refreshes request HTML and must be handled by Vite's SPA fallback.
  // Only non-HTML requests (the actual API calls) should reach Django.
  bypass: (request: { headers: { accept?: string }; url?: string }) => {
    if (request.headers.accept?.includes('text/html')) return request.url;
    return undefined;
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the Django backend so everything is same-origin.
    // This avoids cross-origin cookie issues (CSRF, session) during development.
    proxy: {
      '/api': {
        ...apiProxy,
      },
      '/user': {
        ...apiProxy,
      },
      '/profile': {
        ...apiProxy,
      },
      '/emails': {
        ...apiProxy,
      },
      '/email': {
        ...apiProxy,
      },
      '/events': {
        ...apiProxy,
      },
      '/announcements': {
        ...apiProxy,
      },
      '/conversations': {
        ...apiProxy,
      },
      '/messages': {
        ...apiProxy,
      },
      '/notifications': {
        ...apiProxy,
      },
      '/d1': {
        ...apiProxy,
      },
      '/blog': {
        ...apiProxy,
      },
      '/applications': {
        ...apiProxy,
      },
      '/get_dashboard_data': {
        ...apiProxy,
      },
      '/collaborations': {
        ...apiProxy,
      },
      '/board-members': {
        ...apiProxy,
      },
      '/courses': {
        ...apiProxy,
      },
      '/core-values': {
        ...apiProxy,
      },
      // Catch-all for Django static/media files if needed
      '/static': {
        ...apiProxy,
      },
      '/media': {
        ...apiProxy,
      },
    },
  },
})
