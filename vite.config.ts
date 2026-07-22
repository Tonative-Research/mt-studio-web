import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Real backend origin, e.g. https://mt-studio.tonative.org
  // Force https explicitly: nginx 301-redirects any http:// request, and
  // Vite's dev proxy does NOT follow that redirect the way a browser would —
  // it can end up resolving back to the dev server itself and serving the
  // SPA fallback HTML instead of the real API response. If .env ever has a
  // plain http:// value (or none), normalize it here rather than trust it blindly.
  const rawApiTarget = env.VITE_REACT_APP_MTSTUDIO_ENDPOINT;
  const apiTarget = rawApiTarget ? rawApiTarget.replace(/^http:\/\//, 'https://') : rawApiTarget;

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
    server: {
      // TEMP CORS workaround for local dev only — remove once backend allowlists
      // http://localhost:3000. The browser only ever talks to localhost (same
      // origin, no CORS check); Vite forwards the request server-side, where
      // CORS doesn't apply at all.
      proxy: apiTarget
        ? {
            '/services': {
              target: apiTarget,
              changeOrigin: true,
            },
            '/auth': {
              target: apiTarget,
              changeOrigin: true,
            },
            '/account': {
              target: apiTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});