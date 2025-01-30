import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async (): Promise<UserConfig> => {
  return {
    envDir: 'app-env',
    plugins: [react(), tsconfigPaths(), createHtmlPlugin()],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 7500,
      outDir: './build',
      target: 'esnext',
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    base: '/',
  };
});
