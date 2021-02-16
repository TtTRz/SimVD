const { series, parallel } = require('gulp');

function clean(cb) {
  cb();
}

function cleanCjs() {

}

function  cleanEsm() {

}

function build(cb) {
  cb();
}

exports.build = build;
exports.default = series(clean, build);