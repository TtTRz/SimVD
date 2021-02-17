const { series, parallel } = require('gulp');
const rollup = require('rollup');
// const rollupTypescript = require('rollup-plugin-typescript');
const del = require('del');
const gulp = require('gulp')
const rename = require('gulp-rename')
const resolve = require('rollup-plugin-node-resolve')


function clean(cb) {
    cleanCjs()
    cleanEsm()
  cb();
}

function cleanCjs(cb) {
  del([
    'cjs/**/*',
  ], cb);
}

function  cleanEsm(cb) {
  del([
    'esm/**/*',
  ], cb);
}

async function build() {
  const bundle = await rollup.rollup({
    input: 'scripts/index.js',
    plugins: [
      resolve()
    ]
  });
  await bundle.write({
    file: './esm/bundle.js',
    format: 'es',
    name: 'ES',
    sourcemap: true
  })
  await bundle.write({
    file: './cjs/bundle.js',
    format: 'cjs',
    name: 'CJS',
    sourcemap: true
  });

  buildBundleWasm()
}

function buildBundleWasm() {
  gulp.src('pkg/html2VD_bg.wasm')
    .pipe(rename({basename: "bundle_bg"}))
    .pipe(gulp.dest('esm'))
  gulp.src('pkg_node/html2VD_bg.wasm')
    .pipe(rename({basename: "bundle_bg"}))
    .pipe(gulp.dest('cjs'))
}

exports.build = build;
exports.clean = clean;
exports.cleanCjs = cleanCjs;
exports.cleanEsm = cleanEsm;
exports.default = series(clean, build, );