import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';

export default {
  input: './esm/dom.js',
  plugins: [
    includePaths({
      include: {
        '@webreflection/lie': 'esm/promise.js',
        '@ungap/custom-event': 'node_modules/uconnect/esm/custom-event.js'
      }
    }),
    nodeResolve(),
    terser()
  ],
  output: {
    exports: 'named',
    file: './esdom.js',
    format: 'iife',
    name: 'uhooksDOM'
  }
};
