module.exports = {
    addons: ['@storybook/addon-essentials'],
    babel: async (options) => ({
        // Update your babel configuration here
        ...options,
    }),
    framework: '@storybook/react',
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    webpackFinal: async (config, { configType }) => {
        // Make whatever fine-grained changes you need
        // Return the altered config
        return config;
    },
};