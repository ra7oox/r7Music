import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/r7Music/' : '/',
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/lastfm': {
        target: 'https://ws.audioscrobbler.com/2.0',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/lastfm/, ''),
      },
    },
  },
})
