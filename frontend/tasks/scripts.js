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
  'babel-polyfill',
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
  gulp.watch([config.SRC_PATH + 'app/**/*.js'], ['scripts-app', 'scripts-app-individual']);
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

gulp.task('scripts-generate-static-html', () => {
  return commonBrowserify('generate-static-html.js', browserify({
    entries: [config.SRC_PATH + 'generate-static-html.js'],
    debug: config.IS_DEBUG,
    fullPaths: config.IS_DEBUG,
    transform: [babelify],
    standalone: 'generate-static-html',
    bundleExternal: false
  }).external(vendorModules), config.DEST_PATH);
});

gulp.task('scripts-app', () => {
  return commonBrowserify('app.js', browserify({
    entries: [config.SRC_PATH + 'app.js'],
    debug: config.IS_DEBUG,
    fullPaths: config.IS_DEBUG,
    transform: [babelify],
    standalone: 'app',
    bundleExternal: false
  }).external(vendorModules));
});

gulp.task('scripts-app-individual', () => {
  return Promise.all(
    fs.readdirSync(config.SRC_PATH + 'pages')
    .filter(entry => entry.endsWith('.js'))
    .map(entry => new Promise((resolve, reject) => {
      if (!fs.existsSync(config.DEST_PATH + 'static/app/')) {
        fs.mkdirSync(config.DEST_PATH + 'static/app/');
      }
      browserify({
        entries: [config.SRC_PATH + 'pages/' + entry],
        debug: config.IS_DEBUG,
        fullPaths: config.IS_DEBUG,
        transform: [babelify],
        standalone: entry.slice(0, entry.indexOf('.')),
        bundleExternal: false
      }).external(vendorModules).bundle().pipe(
        fs.createWriteStream(config.DEST_PATH + 'static/app/' + entry)
          .on('finish', resolve)
      );
    }))
  );
});

gulp.task('scripts-app-vendor', () => {
  return commonBrowserify('vendor.js', browserify({
    debug: config.IS_DEBUG,
  }).require(vendorModules));
});

gulp.task('scripts-build', done => runSequence(
  'scripts-clean',
  'scripts-lint',
  'scripts-generate-static-html',
  'scripts-app-individual',
  'scripts-app',
  'scripts-misc',
  'scripts-app-vendor',
  done
));

function commonBrowserify(sourceName, b, destPath) {
  if (typeof destPath === 'undefined') {
    destPath = config.DEST_PATH + 'static/app/';
  }
  return b
    .bundle()
    .pipe(source(sourceName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!config.IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destPath));
}
