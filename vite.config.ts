
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use process.cwd() with type casting to avoid TypeScript error on standard Node.js global
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    define: {
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || env.VITE_API_KEY || '')
      }
    }
  };
});
