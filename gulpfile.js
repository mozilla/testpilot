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

const SRC_PATH = './idea_town/frontend/static-src/';
const DEST_PATH = './idea_town/frontend/static/';

// HACK: Under Docker, the node_modules install has been moved.
// So, look for the vendor assets there. Otherwise, look in current dir
const NODE_MODULES_PATH = ('NODE_PATH' in process.env) ?
    process.env.NODE_PATH.split(':')[0] :
    './node_modules/';

// Lint the gulpfile
gulp.task('selfie', function selfieTask() {
  return gulp.src('gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Lint the *.js files
gulp.task('lint', function lintTask() {
  return gulp.src(['*.js', SRC_PATH + 'scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean', function cleanTask(done) {
  del([
    DEST_PATH
  ], done);
});

gulp.task('npm:tabzilla:img', function npmTabzillaImgTask() {
  return gulp.src(NODE_MODULES_PATH + 'mozilla-tabzilla/media/**')
    .pipe(gulp.dest(DEST_PATH + 'vendor/mozilla-tabzilla/media/'));
});

// Copy the tabzilla assets into the src dir for inclusion in minimization
gulp.task('npm:tabzilla:css', function npmTabzillaCssTask() {
  return gulp.src(NODE_MODULES_PATH + 'mozilla-tabzilla/css/tabzilla.css')
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest(SRC_PATH + 'vendor/'));
});

// Copy the normalize assets into the src dir for inclusion in minimization
gulp.task('npm:normalize', function npmNormalizeTask() {
  return gulp.src(NODE_MODULES_PATH + 'normalize.css/normalize.css')
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest(SRC_PATH + 'vendor/'));
});

gulp.task('vendor', function vendorTask(done) {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

// Scripts
gulp.task('scripts', function scriptsTask() {
  const b = browserify(SRC_PATH + 'scripts/main.js', {
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
    .pipe(gulp.dest(DEST_PATH + 'scripts'));
});

// Styles
gulp.task('styles', function stylesTask() {
  return gulp.src(SRC_PATH + 'styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(DEST_PATH + 'styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(DEST_PATH + 'styles'));
});

// Images
gulp.task('images', function imagesTask() {
  return gulp.src(SRC_PATH + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_PATH + 'images'));
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
  gulp.watch(SRC_PATH + 'styles/**/*', ['styles']);
  gulp.watch(SRC_PATH + 'images/**/*', ['images']);
  gulp.watch(SRC_PATH + 'scripts/**/*', ['scripts']);
});

// Set up a webserver for the static assets
gulp.task('connect', function connectTask () {
  connect.server({
    root: DEST_PATH,
    livereload: false,
    port: 9988
  });
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['server']);
