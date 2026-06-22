import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'services': path.resolve(__dirname, './src/services'),
        'types': path.resolve(__dirname, './src/types'),
        'utils': path.resolve(__dirname, './src/utils'),
        'contexts': path.resolve(__dirname, './src/contexts'),
        'themes': path.resolve(__dirname, './src/themes'),
      },
    },
  };
});
