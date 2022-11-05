import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
// @ts-ignore
import path from "path";

const packageJson = require("./package.json");
const outputDir = "dist";

const postcssOptions = () => ({
  extensions: [".scss"],
  extract: false,
  minimize: true,
  use: {
    "stylus": undefined,
    "less": undefined,
    "sass":
        {
          includePaths: [
            "./node_modules",
            // This is only needed because we're using a local module. :-/
            // Normally, you would not need this line.
            path.resolve(__dirname, "..", "node_modules"),
          ],
        }
  }
});

export default {
  input: "index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      exclude: ["src/stories/**/*.*"]
    }),
    postcss(postcssOptions()),
    json(),
    copy({
      targets: [
        {
          src: "src/components/GridTheme.scss",
          dest: `${outputDir}`,
        },
      ],
    }),
  ],
};
