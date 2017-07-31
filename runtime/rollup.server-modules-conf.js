const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

export default {
  entry: "./server/modules/index.ts",
  format: "umd",
  moduleName: "server-modules",
  dest: "./dist/server-module.js",
  sourceMap: true,
  plugins: [
    rollupTypescript()
  ]
}
