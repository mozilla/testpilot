const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('addon-copy-locales', () =>
  gulp.src('./locales/**/addon.properties')
    .pipe(rename(path => {
      // Transform {LOCALE}/addon.properties -> {LOCALE}.properties
      path.basename = path.dirname;
      path.dirname = '';
    }))
    .pipe(gulp.dest('./addon/locale'))
);

gulp.task('addon-watch-locales', () =>
  gulp.watch('./locales/**/addon.properties', ['addon-copy-locales']));
