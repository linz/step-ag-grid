// vite.config.ts
import { defineConfig, UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(async (): Promise<UserConfig> => {
  return {
    envDir: "app-env",
    plugins: [react(), tsconfigPaths(), createHtmlPlugin()],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 7500,
      outDir: "./build",
      target: "esnext",
    },
    resolve: {
      alias: {
        //...stdLibBrowser,
        //"ag-grid-react": path.resolve(__dirname, "./node_modules/ag-grid-react/bundles/ag-grid-react.min.js"),
      },
    },
    base: "/",
  };
});
