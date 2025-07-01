import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Optimize for mobile performance
    target: 'es2015', // Better mobile compatibility
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy libraries into separate chunks
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          ogl: ['ogl'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three', 'gsap', 'ogl'],
  },
  server: {
    // Optimize for mobile development
    host: true,
    port: 3000,
  },
  define: {
    // Add global constants for mobile detection
    __IS_MOBILE__: JSON.stringify(false), // Will be set at runtime
  },
})
