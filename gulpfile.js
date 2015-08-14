const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cache = require('gulp-cache');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const minifycss = require('gulp-minify-css');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');

const IS_DEBUG = true;

// Lint the gulpfile
gulp.task('selfie', function selfieTask() {
  return gulp.src('gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Lint the *.js files
gulp.task('lint', function lintTask() {
  return gulp.src(['*.js', 'static-src/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean', function cleanTask(done) {
  del([
    'static'
  ], done);
});

gulp.task('npm:tabzilla:img', function npmTabzillaImgTask() {
  return gulp.src('node_modules/mozilla-tabzilla/media/**')
    .pipe(gulp.dest('static/vendor/mozilla-tabzilla/media'));
});

gulp.task('npm:tabzilla:css', function npmTabzillaCssTask() {
  return gulp.src('./node_modules/mozilla-tabzilla/css/tabzilla.css')
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest('./static-src/vendor'));
});

gulp.task('npm:normalize', function npmNormalizeTask() {
  return gulp.src('./node_modules/normalize.css/normalize.css')
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest('./static-src/vendor'));
});

// Scripts
gulp.task('scripts', function scriptsTask() {
  const b = browserify('./static-src/scripts/main.js', {
    debug: IS_DEBUG
  });

  return b
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./static/scripts'));
});

// Styles
gulp.task('styles', function stylesTask() {
  return gulp.src('./static-src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('static/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('static/styles'));
});

// Images
gulp.task('images', function imagesTask() {
  return gulp.src('./static-src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('static/images'));
});

gulp.task('vendor', function vendorTask(done) {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

gulp.task('build', function buildTask(done) {
  runSequence(
    'clean',
    'vendor',
    'scripts',
    'styles',
    'images',
    done
  );
});

// Watches the things
gulp.task('watch', ['build'], function watchTask () {
  gulp.watch('static-src/styles/**/*', ['styles']);
  gulp.watch('static-src/images/**/*', ['images']);
  gulp.watch('static-src/scripts/**/*', ['scripts']);
});

// Set up a webserver for the static assets
gulp.task('connect', function connectTask () {
  connect.server({
    root: 'static',
    livereload: false,
    port: 9988
  });
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['server']);
