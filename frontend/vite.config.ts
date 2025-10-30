import { defineConfig } from 'vite';

// Use async config and dynamic import for ESM-only plugins to avoid require() errors
export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default;
  return {
    plugins: [react()],
    server: { port: 5173 },
  };
});
