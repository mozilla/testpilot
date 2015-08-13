var debug = true;

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');

// Lint the gulpfile
gulp.task('selfie', function(){
  return gulp.src('gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Lint the *.js files
gulp.task('lint', function() {
  return gulp.src(['*.js', 'static-src/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean', function (done) {
  del([
    'static'
  ], done);
});

gulp.task('npm:tabzilla:img', function() {
  return gulp.src('node_modules/mozilla-tabzilla/media/**')
    .pipe(gulp.dest('static/vendor/mozilla-tabzilla/media'));
});

gulp.task('npm:tabzilla:css', function() {
  return gulp.src('./node_modules/mozilla-tabzilla/css/tabzilla.css')
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest('./static-src/vendor'));
});

gulp.task('npm:normalize', function() {
  return gulp.src('./node_modules/normalize.css/normalize.css')
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest('./static-src/vendor'));
});

// Scripts
gulp.task('scripts', function () {
  var b = browserify('./static-src/scripts/main.js', {
    debug: debug
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
    .pipe(gulp.dest('./static/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Styles
gulp.task('styles', function () {
  return gulp.src('./static-src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('static/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('static/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('./static-src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('static/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('vendor', function (done) {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

gulp.task('build', function (done) {
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
gulp.task('default', ['build'], function() {
  gulp.watch('static-src/styles/**/*', ['styles']);
  gulp.watch('static-src/images/**/*', ['images']);
  gulp.watch('static-src/scripts/**/*', ['scripts']);
});
