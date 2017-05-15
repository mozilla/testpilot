const gulp = require('gulp');
const config = require('../config.js');
const path = require('path');
const fs = require('fs');

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');

const packageJSON = require('../../package.json');

const excludeVendorModules = [
  'babel-polyfill'
];

const includeVendorModules = [
  'babel-polyfill/browser',
  'react/lib/ReactDOMFactories',
  'querystring'
];

const vendorModules = Object.keys(packageJSON.dependencies)
  .filter(name => excludeVendorModules.indexOf(name) < 0)
  .concat(includeVendorModules);

function shouldLint(opt, task) {
  return config[opt] ? [task] : [];
}

gulp.task('scripts-lint', () => {
  return gulp.src([config.SRC_PATH + '*.js', config.SRC_PATH + '{app,tests}/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('scripts-clean', () => {
});

gulp.task('scripts-watch', () => {
  gulp.watch([config.SRC_PATH + 'app/**/*.js'], ['scripts-app-main']);
  gulp.watch('../../package.json', ['scripts-app-vendor']);
  gulp.watch(config.SRC_PATH + 'scripts/**/*.js', ['scripts-misc']);
});

gulp.task('scripts-misc', () => {
  return gulp.src(config.SRC_PATH + 'scripts/**/*')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(!config.IS_DEBUG, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.DEST_PATH + 'static/scripts'));
});

gulp.task('scripts-app-main', () => {
  return commonBrowserify('app.js', browserify({
    entries: [config.SRC_PATH + 'app/index.js'],
    debug: config.IS_DEBUG,
    fullPaths: config.IS_DEBUG,
    transform: [babelify],
    standalone: 'app',
    bundleExternal: false
  }).external(vendorModules));
});

gulp.task('scripts-app-vendor', () => {
  return commonBrowserify('vendor.js', browserify({
    debug: config.IS_DEBUG
  }).require(vendorModules));
});

gulp.task('scripts-build', done => runSequence(
  'scripts-clean',
  'scripts-lint',
  'scripts-misc',
  'scripts-app-main',
  'scripts-app-vendor',
  done
));

function commonBrowserify(sourceName, b) {
  return b
    .bundle()
    .pipe(source(sourceName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!config.IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.DEST_PATH + 'static/app/'));
}
