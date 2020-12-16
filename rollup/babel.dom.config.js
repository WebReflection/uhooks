import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './esm/dom.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    exports: 'named',
    file: './dom.js',
    format: 'iife',
    name: 'uhooksDOM'
  }
};
