/* eslint-disable import/no-extraneous-dependencies*/
require("babel-polyfill");

// HACK: Ignore non-JS imports used for asset dependencies in Webpack
require.extensions[".scss"] = () => {};

const gulp = require("gulp");
const config = require("./frontend/config.js");

const del = require("del");
const runSequence = require("run-sequence");

require("es6-promise").polyfill();
require("isomorphic-fetch");

require("./frontend/tasks/pages");
require("./frontend/tasks/dist");

gulp.task("clean", () => del([
  config.DEST_PATH,
  config.DIST_PATH
]));

gulp.task("distclean", () => del([
  config.DEST_PATH,
  config.DIST_PATH,
  "./node_modules",
  "./addon/node_modules"
]));

gulp.task("build", done => runSequence(
  "pages-build",
  done
));

gulp.task("watch", [
  "self-watch",
  "pages-watch"
]);

gulp.task("default", done => runSequence(
  "clean",
  "build",
  "watch",
  done
));

// Exit if the gulpfile changes so we can self-reload with a wrapper script.
gulp.task("self-watch", () => gulp.watch([
  "./gulpfile.babel.js",
  "./webpack.config.js",
  "./frontend/config.js",
  "./debug-config.json",
  "./frontend/tasks/*.js"
], () => process.exit()));
