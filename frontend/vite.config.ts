import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core must be in one chunk to prevent useLayoutEffect circular dep bug
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'react-vendor';
            if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('@tanstack')) return 'query';
            if (id.includes('date-fns')) return 'vendor-date';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('sonner') || id.includes('zod') || id.includes('hookform') || id.includes('cmdk')) return 'vendor-utils';
            if (id.includes('react-router') || id.includes('next-themes') || id.includes('react-day-picker') || id.includes('react-type-animation')) return 'react-vendor';
          }
        },
      },
    },
  },
})
