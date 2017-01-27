const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('x16-copy-locales', () =>
  gulp.src('./locales/**/addon.properties')
    .pipe(rename(path => {
      // Transform {LOCALE}/addon.properties -> {LOCALE}.properties
      path.basename = path.dirname;
      path.dirname = '';
    }))
    .pipe(gulp.dest('./x16/locale'))
);

gulp.task('x16-watch-locales', () =>
  gulp.watch('./locales/**/addon.properties', ['x16-copy-locales']));
