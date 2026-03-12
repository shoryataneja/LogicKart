import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /images requests to backend so SVGs load without CORS issues
      '/images': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
})
