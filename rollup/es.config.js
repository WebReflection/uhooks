import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';

export default {
  input: './esm/index.js',
  plugins: [
    includePaths({
      include: {
        '@webreflection/lie': 'esm/promise.js'
      }
    }),
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    exports: 'named',
    file: './es.js',
    format: 'iife',
    name: 'uhooks'
  }
};
