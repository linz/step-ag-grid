const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
module.exports = {
  // Specifying the location of the stories and file formats of what stories can be
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  // Specifying the add ons for Storybook if requiring specific add ons to make a story work then add them here
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-mock/register",
    "@storybook/addon-interactions",
  ],
  webpackFinal: async (config) => {
    // Handling scss files when used within components consumed by a story
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            webpackImporter: true,
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [
          [
            "react-app",
            {
              flow: false,
              typescript: true,
            },
          ],
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
            },
          ],
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
