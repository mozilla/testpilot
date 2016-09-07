const gulp = require('gulp');
const config = require('../config.js');

const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const gulpif = require('gulp-if');
const minifycss = require('gulp-cssnano');
const normalize = require('node-normalize-scss');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('styles-lint', () => {
  const files = [
    config.SRC_PATH + '/styles/**/*.scss',
    '!' + config.SRC_PATH + '/styles/_hidpi-mixin.scss'
  ];
  return gulp.src(files)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('styles-clean', () => del([
  config.DEST_PATH + 'styles'
]));

gulp.task('styles-build', ['styles-lint', 'styles-clean'], () => {
  return gulp.src(config.SRC_PATH + 'styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: [normalize.includePaths]})
    .on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
      // don't minify in development
      .pipe(gulpif(!config.IS_DEBUG, minifycss()))
      .pipe(gulpif(config.IS_DEBUG, sourcemaps.write('.')))
    .pipe(gulp.dest(config.DEST_PATH + 'static/styles'));
});

gulp.task('styles-watch', () => {
  gulp.watch(config.SRC_PATH + 'styles/**/*', ['styles-build']);
});
