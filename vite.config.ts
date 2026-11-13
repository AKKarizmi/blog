import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/d1": "http://127.0.0.1:8000", "/v1": "http://127.0.0.1:8000", "/contact": "http://127.0.0.1:8000", "/media": "http://127.0.0.1:8000" } },
})
