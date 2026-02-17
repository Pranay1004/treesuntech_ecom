import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase: ~200KB gzipped — load as separate chunk (lazy loaded now)
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Framer Motion: ~100KB — separate chunk
          'framer-motion': ['framer-motion'],
          // React core: cached separately
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    target: 'es2020',
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})
