const gulp = require('gulp');
const config = require('../config.js');

const merge = require('merge-stream');

gulp.task('django-api-copy', () => merge(
  gulp.src(config.DEST_PATH + 'api/**/*')
    .pipe(gulp.dest(config.DEST_PATH + 'static/api'))
));

gulp.task('django-api-watch', () =>
  gulp.watch(config.DEST_PATH + 'api/**/*', ['dist-django-api-copy']));
