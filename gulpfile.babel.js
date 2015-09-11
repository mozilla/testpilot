import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import bourbon from 'node-bourbon';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import cache from 'gulp-cache';
import connect from 'gulp-connect';
import del from 'del';
import eslint from 'gulp-eslint';
import globby from 'globby';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';
import minifycss from 'gulp-minify-css';
import neat from 'node-neat';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import through from 'through2';
import uglify from 'gulp-uglify';

// TODO: ENV VAR to check prod/dev?
const IS_DEBUG = true;

const SRC_PATH = './idea_town/frontend/static-src/';
const DEST_PATH = './idea_town/frontend/static/';

// HACK: Under Docker, the node_modules install has been moved.
// So, look for the vendor assets there. Otherwise, look in current dir
const NODE_MODULES_PATH = ('NODE_PATH' in process.env) ?
    process.env.NODE_PATH.split(':')[0] :
    './node_modules/';

function lintTask() {
  return gulp.src(['*.js', `${SRC_PATH}app/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

gulp.task('build', (done) => {
  runSequence(
    'clean',
    'vendor',
    'scripts',
    'styles',
    'images',
    done
  );
});

gulp.task('clean', (done) => {
  del([
    DEST_PATH
  ], done);
});

// Set up a webserver for the static assets
gulp.task('connect', () => {
  connect.server({
    livereload: false,
    port: 9988,
    root: DEST_PATH
  });
});

gulp.task('default', ['build', 'watch']);

gulp.task('images', () => {
  return gulp.src(`${SRC_PATH}images/**/*`)
    .pipe(cache(imagemin({
      interlaced: true,
      optimizationLevel: 3,
      progressive: true
    })))
    .pipe(gulp.dest(`${DEST_PATH}images`));
});

gulp.task('lint', lintTask);

/* Copy the normalize assets into the src dir for inclusion in minimization */
gulp.task('npm:normalize', () => {
  return gulp.src(`${NODE_MODULES_PATH}normalize.css/normalize.css`)
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest(`${SRC_PATH}vendor/`));
});

/* Copy the tabzilla assets into the src dir for inclusion in minimization */
gulp.task('npm:tabzilla:css', () => {
  return gulp.src(`${NODE_MODULES_PATH}mozilla-tabzilla/css/tabzilla.css`)
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest(`${SRC_PATH}vendor/`));
});

gulp.task('npm:tabzilla:img', () => {
  return gulp.src(`${NODE_MODULES_PATH}mozilla-tabzilla/media/**`)
    .pipe(gulp.dest(`${DEST_PATH}vendor/mozilla-tabzilla/media/`));
});

/* based on https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md,
except we use the Promise returned by globby, instead of passing it a callback */
gulp.task('scripts', () => {
  const bundledStream = through();

  // this part runs second
  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${DEST_PATH}app/`));

  // this part runs first, then pipes to bundledStream
  globby([`${SRC_PATH}app/**/*.js`]).then((entries) => {
    const b = browserify({
      entries: entries,
      debug: IS_DEBUG,
      transform: [babelify]
    });
    b.bundle()
      .pipe(bundledStream);
  }, function onGlobbyError(err) {
    return bundledStream.emit('error', err);
  });

  return bundledStream;
});

// Lint the gulpfile
gulp.task('selfie', () => {
  return gulp.src('gulpfile.babel.js')
    .pipe(lintTask());
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('styles', () => {
  return gulp.src(`${SRC_PATH}styles/**/*.scss`)
    .pipe(sass({
      includePaths: bourbon.with(neat.includePaths)
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(`${DEST_PATH}styles`))
      // don't minify in development
      .pipe(gulpif(!IS_DEBUG, rename({ suffix: '.min' })))
      .pipe(gulpif(!IS_DEBUG, minifycss()))
    .pipe(gulp.dest(`${DEST_PATH}styles`));
});

gulp.task('vendor', (done) => {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

gulp.task('watch', ['build'], () => {
  gulp.watch(`${SRC_PATH}styles/**/*`, ['styles']);
  gulp.watch(`${SRC_PATH}images/**/*`, ['images']);
  gulp.watch(`${SRC_PATH}app/**/*.js`, ['scripts']);
});
