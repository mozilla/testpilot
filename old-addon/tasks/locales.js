const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('old-addon-copy-locales', () =>
  gulp.src('./locales/**/addon.properties')
    .pipe(rename(path => {
      // Transform {LOCALE}/addon.properties -> {LOCALE}.properties
      path.basename = path.dirname;
      path.dirname = '';
    }))
    .pipe(gulp.dest('./old-addon/locale'))
);

gulp.task('old-addon-watch-locales', () =>
  gulp.watch('./locales/**/addon.properties', ['addon-copy-locales']));
