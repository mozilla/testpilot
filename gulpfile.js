const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cache = require('gulp-cache');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const globby = require('globby');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const minifycss = require('gulp-cssnano');
const normalize = require('node-normalize-scss');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const through = require('through2');
const uglify = require('gulp-uglify');
const tryRequire = require('try-require');

const IS_DEBUG = (process.env.NODE_ENV === 'development');

const SRC_PATH = './testpilot/frontend/static-src/';
const DEST_PATH = './testpilot/frontend/static/';

const config = tryRequire('./debug-config.json') || {
  'sass-lint': true,
  'js-lint': true
};

function shouldLint(opt, task) {
  return config[opt] ? [task] : [];
}

function lintTask() {
  return gulp.src(['*.js', SRC_PATH + 'app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

gulp.task('lint', lintTask);

// Lint the gulpfile
gulp.task('selfie', function selfieTask() {
  return gulp.src('gulpfile.js')
    .pipe(lintTask());
});

gulp.task('clean', function cleanTask() {
  return del([
    DEST_PATH
  ]);
});

// based on https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md,
// except we use the Promise returned by globby, instead of passing it a callback.
gulp.task('scripts', shouldLint('js-lint', 'lint'), function scriptsTask() {
  const bundledStream = through();

  // this part runs second
  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(IS_DEBUG, sourcemaps.init({loadMaps: true})))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(gulpif(IS_DEBUG, sourcemaps.write('./')))
    .pipe(gulp.dest(DEST_PATH + 'app/'));

  // this part runs first, then pipes to bundledStream
  globby([SRC_PATH + 'app/**/*.js']).then(function gatherFiles(entries) {
    const b = browserify({
      entries: entries,
      debug: IS_DEBUG,
      fullPaths: IS_DEBUG,
      transform: [babelify]
    });
    b.bundle()
      .pipe(bundledStream);
  }, function onGlobbyError(err) {
    return bundledStream.emit('error', err);
  });

  return bundledStream;
});

gulp.task('styles', shouldLint('sass-lint', 'sass-lint'), function stylesTask() {
  return gulp.src(SRC_PATH + 'styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        normalize.includePaths
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
      // don't minify in development
      .pipe(gulpif(!IS_DEBUG, minifycss()))
      .pipe(gulpif(IS_DEBUG, sourcemaps.write('.')))
    .pipe(gulp.dest(DEST_PATH + 'styles'));
});

// the globbing pattern here should be cleaned up
// when node-sass supports inline ignores
// see the note in the _hidpi-mixin for details
gulp.task('sass-lint', function sassLintTask() {
  const files = [
    SRC_PATH + '/styles/**/*.scss',
    '!' + SRC_PATH + '/styles/_hidpi-mixin.scss'
  ];
  return gulp.src(files)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('images', function imagesTask() {
  return gulp.src(SRC_PATH + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_PATH + 'images'));
});

gulp.task('locales', function localesTask() {
  return gulp.src('./locales/**/*')
    .pipe(gulp.dest(DEST_PATH + 'locales'));
});

gulp.task('addon', function localesTask() {
  return gulp.src(SRC_PATH + 'addon/**/*')
    .pipe(gulp.dest(DEST_PATH + 'addon'));
});

gulp.task('build', function buildTask(done) {
  runSequence(
    'clean',
    'scripts',
    'styles',
    'images',
    'locales',
    'addon',
    done
  );
});

gulp.task('watch', ['build'], function watchTask() {
  gulp.watch(SRC_PATH + 'styles/**/*', ['styles']);
  gulp.watch(SRC_PATH + 'images/**/*', ['images']);
  gulp.watch(SRC_PATH + 'app/**/*.js', ['scripts']);
  gulp.watch('./locales/**/*', ['locales']);
});

// Set up a webserver for the static assets
gulp.task('connect', function connectTask() {
  connect.server({
    root: DEST_PATH,
    livereload: false,
    port: 9988
  });
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['build', 'watch']);
