const { series, parallel } = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');
function clean(cb) {
  cb();
}

function cleanCjs() {

}

function  cleanEsm() {

}

async function build() {
  
}

function buidlBundleWasm() {
  
}

exports.build = build;
exports.default = series(clean, build);