var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('build', function () {
  // Nothing yet.
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: { port: 35742 },
    port: 8899
  });
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['build']);
});

gulp.task('deploy', function () {
  gulp.src('./dist/**/*')
    .pipe(deploy({}));
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['server']);
