const gulp = require('gulp');
const config = require('../config.js');

const connect = require('gulp-connect');
const historyApiFallback = require('connect-history-api-fallback');

gulp.task('server', () => {
  connect.server({
    root: config.DEST_PATH,
    livereload: false,
    host: '0.0.0.0',
    port: config.SERVER_PORT,
    middleware: (connect, ops) => [historyApiFallback({})]
  });
});
