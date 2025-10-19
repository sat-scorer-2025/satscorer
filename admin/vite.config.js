import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['api.satscorer.com','www.satscorer.com','satscorer.com','admin.satscorer.com','http://localhost:5000'],
  },
  build: {
    rollupOptions: {
      external: ['react-is'],
    },
  },
  optimizeDeps: {
    include: ['react-is']
  }
});