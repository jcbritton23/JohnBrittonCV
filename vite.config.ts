/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/JohnBrittonCV/', // Set base for GitHub Pages deployment
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5050'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
}) 