import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { proxy: {
    '/api/auth': { target: 'http://127.0.0.1:8000', changeOrigin: true, rewrite: path => path.replace(/^\/api\/auth/, '/lms/v1/auth') },
    '/api/backend': { target: 'http://127.0.0.1:8000', changeOrigin: true, rewrite: path => path.replace(/^\/api\/backend/, '') },
    '/v1': 'http://127.0.0.1:8000', '/d1': 'http://127.0.0.1:8000', '/contact': 'http://127.0.0.1:8000', '/media': 'http://127.0.0.1:8000'
  } }
});
