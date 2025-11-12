// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite';
import {loadConfigFromFile, mergeConfig} from "vite";
import * as path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  // Required
  framework: '@storybook/react-vite',

  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  // Optional
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook"
  ],

  async viteFinal(config) {
    const { config: userConfig } = (await loadConfigFromFile({
          command: 'serve',
          mode: 'prod'
        },
        path.resolve(__dirname, "../vite.config.ts")
    ))!;

    return mergeConfig(config, {
      resolve: userConfig.resolve,
      plugins: [
        tsconfigPaths()
      ],
    });
  },

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};

export default config;
