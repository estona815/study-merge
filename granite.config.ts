import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'sagwal',
  brand: {
    displayName: '사괄',
    primaryColor: '#2F7D72',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build:web',
    },
  },
  permissions: [
    {
      name: 'camera',
      access: 'access',
    },
    {
      name: 'photos',
      access: 'read',
    },
  ],
  outdir: 'dist',
});
