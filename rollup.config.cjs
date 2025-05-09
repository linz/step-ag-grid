const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
const json = require('@rollup/plugin-json');
const path = require('path');

const packageJson = require('./package.json');
const outputDir = 'dist';

const postcssOptions = () => ({
  extensions: ['.scss'],
  extract: false,
  minimize: true,
  use: {
    stylus: undefined,
    less: undefined,
    sass: {
      api: 'modern',
      includePaths: [
        './node_modules',
        // This is only needed because we're using a local module. :-/
        // Normally, you would not need this line.
        path.resolve(__dirname, '..', 'node_modules'),
      ],
    },
  },
});

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ preferBuiltins: true }),
    commonjs(),
    typescript({
      exclude: ['src/stories/**/*.*', 'src/**/__tests__/*.*'],
    }),
    postcss(postcssOptions()),
    json(),
    copy({
      targets: [
        {
          src: 'src/styles/GridTheme.scss',
          dest: `${outputDir}`,
        },
        {
          src: 'src/utils/__tests__/*.ts',
          dest: `${outputDir}/src/utils/__tests__/`,
        },
      ],
    }),
  ],
};
