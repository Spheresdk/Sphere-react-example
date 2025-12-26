import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force Vite to use the example's version of React to prevent context breakage
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      // Ensure the SDK is resolved correctly
      '@sphere/connect': path.resolve('../../dist/index.mjs')
    },
    preserveSymlinks: true
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  },
  define: {
    'global': 'globalThis',
  }
})
