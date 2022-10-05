const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

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
    ],
    webpackFinal: async (config) => {
        // Handling scss files when used within components consumed by a story
        config.module.rules.push({
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
            include: path.resolve(__dirname, "../"),
        });

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve("babel-loader"),
            options: {
                presets: [
                    ["react-app", { flow: false, typescript: true }],
                    ["@babel/preset-react", { runtime: "automatic" }],
                ],
            },
        });
        // Resolving the paths for dynamic locations (@components -> ./xxx/xxx/xxx/Components)
        config.resolve.plugins = [
            ...(config.resolve.plugins || []),
            new TsconfigPathsPlugin({
                extensions: config.resolve.extensions,
            }),
        ];

        // Return the altered config
        return config;
    },
};