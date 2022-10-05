module.exports = {
    babel: async (options) => ({
        // Update your babel configuration here
        ...options,
    }),
    framework: '@storybook/react',
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "storybook-addon-mock/register",
        "@storybook/addon-interactions",
    ],
    webpackFinal: async (config, { configType }) => {
        // Make whatever fine-grained changes you need
        // Return the altered config
        return config;
    },
};