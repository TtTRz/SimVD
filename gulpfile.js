const { series, parallel } = require('gulp');
const rollup = require('rollup');
const del = require('del');
const gulp = require('gulp')
const rename = require('gulp-rename')
const resolve = require('rollup-plugin-node-resolve')

const BUNDLE_NAME = "bundle";
const watch = require('gulp-watch');


async function clean(cb) {
    await Promise.all([cleanCjs(), cleanEsm()])
    cb()
}

function cleanCjs() {
  return del([
    'cjs/**/*',
  ]);
}

function cleanEsm() {
  return del([
    'esm/**/*',
  ]);
}

async function build(cb) {
  await buildEsm();
  await buildCjs();
  cb()
}

async function buildEsm() {
  const bundle = await rollup.rollup({
    input: 'scripts/index.js',
    plugins: [
      resolve()
    ]
  });
  await bundle.write({
    file: `./esm/${BUNDLE_NAME}.js`,
    format: 'es',
    name: 'ES',
    sourcemap: true
  })
  await gulp.src('pkg/html2VD_bg.wasm')
    .pipe(rename({basename: `${BUNDLE_NAME}_bg`}))
    .pipe(gulp.dest('esm'))
}

async function buildCjs() {
  const bundle = await rollup.rollup({
    input: 'scripts/index.js',
    plugins: [
      resolve()
    ]
  });
  await bundle.write({
    file: `./cjs/${BUNDLE_NAME}.js`,
    format: 'cjs',
    name: 'CJS',
    sourcemap: true,
    exports: "default"
  });

  await gulp.src('pkg_node/html2VD_bg.wasm')
    .pipe(rename({basename: `${BUNDLE_NAME}_bg`}))
    .pipe(gulp.dest('cjs'))
}

async function watch_mode() {
  gulp.series(cleanEsm, buildEsm)
  gulp.watch("scripts/**/*", gulp.series(cleanEsm, buildEsm))
}
exports.watch = watch_mode;

exports.default = series(clean, build);