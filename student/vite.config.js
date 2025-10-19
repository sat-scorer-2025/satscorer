import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@chialab/esbuild-plugin-commonjs'; // Use default import

export default defineConfig({
  plugins: [
    react(),
    commonjs(), // Use the default export
  ],
  resolve: {
    alias: {
      'react-dom/client': 'react-dom/client',
      'react/jsx-runtime': 'react/jsx-runtime',
      'react-dom': 'react-dom',
      'react': 'react',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Handle mixed ESM/CommonJS modules
    },
  },
  server: {
      host: '0.0.0.0',
      allowedHosts: ['api.satscorer.com','www.satscorer.com','satscorer.com','admin.satscorer.com','http://localhost:5000'],
  },
});