import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const packageJson = require('./package.json');
const outputDir = 'dist';

export default {
  input: 'index.tsx',
  external: [
    'ag-grid-community',
  ],
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
    resolve(),
    commonjs(),
    typescript(),
    postcss(),
    json(),
    copy({
      targets: [
        {
          src: 'src/scss',
          dest: `${outputDir}`,
        },
        {
          src: 'src/assets',
          dest: `${outputDir}`,
        },
      ],
    }),
  ],
};
