import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    tanstackStart({
      rsc: {
        enabled: true,
      },
    }),
    rsc(),
    react(),
  ],
});
