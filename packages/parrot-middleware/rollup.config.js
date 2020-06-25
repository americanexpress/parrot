import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

export default {
  external: Object.keys(pkg.dependencies),
  input: 'src/index.js',
  output: {
    format: 'cjs',
    dir: 'lib',
    preserveModules: true,
  },
  plugins: [resolve(), babel()],
};
