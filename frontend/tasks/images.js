const gulp = require('gulp');
const config = require('../config.js');

// const cache = require('gulp-cache');
// const imagemin = require('gulp-imagemin');

gulp.task('images-build', () => {
  return gulp.src(config.SRC_PATH + 'images/**/*')
    // imagemin skips files https://github.com/sindresorhus/gulp-imagemin/issues/183
    // files have been optimized and rechecked into the repo
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.DEST_PATH + 'static/images'));
});

gulp.task('images-watch', () => {
  gulp.watch(config.SRC_PATH + 'images/**/*', ['images-build']);
});
