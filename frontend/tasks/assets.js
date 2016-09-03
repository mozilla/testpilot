const gulp = require('gulp');
const config = require('../config.js');

gulp.task('assets-locales', () => gulp.src('./locales/**/*')
  .pipe(gulp.dest(config.DEST_PATH + 'static/locales')));

gulp.task('assets-addon', () => gulp.src([
  config.ADDON_SRC_PATH + 'addon.xpi',
  config.ADDON_SRC_PATH + 'update.rdf'
]).pipe(gulp.dest(config.DEST_PATH + 'static/addon')));

gulp.task('assets-build', [
  'assets-locales',
  'assets-addon'
]);

gulp.task('assets-watch', () => {
  gulp.watch('./addon/*.xpi', ['assets-addon']);
  gulp.watch('./locales/**/*', ['assets-locales']);
});
