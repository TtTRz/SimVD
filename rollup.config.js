import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { wasm } from '@rollup/plugin-wasm';

  /**output.format
   *  amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
   *  cjs -- CommonJS, 适用于Node或Browserify/webpack
   *  es -- 将软件包保存为ES模块文件。
   *  iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
   *  umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。
   */
export default {
  input: 'scripts/index.js',
  output: [{
    file: './cjs/bundle.js',
    format: 'cjs',
    exports: "default"
  }, {
    file: './esm/bundle.js',
    format: 'es'
  }],
  plugins: [
    resolve(),
  ]
};