const gulp = require("gulp");
const config = require("../config.js");

const runSequence = require("run-sequence");
const RevAll = require("gulp-rev-all");

gulp.task("dist-rev-assets", function() {
  const revAll = RevAll.revision({
    dontRenameFile: [
      ".json",
      "favicon.ico",
      /static\/app\/images\/*/,
      /static\/addon\/*/,
      /static\/locales\/*/,
      /static\/images\/experiments\/[^]*\/social\/*/,
      ".html",
      ".rss",
      ".atom"
    ],
    dontUpdateReference: [
      /.*\.json/,
      "favicon.ico",
      /static\/app\/images\/*/,
      /static\/addon\/*/,
      /static\/locales\/*/,
      /static\/images\/experiments\/[^]*\/social\/*/,
      /.*\.rss/,
      /.*\.atom/
    ]
  });
  return gulp.src(config.DEST_PATH + "**")
    .pipe(revAll)
    .pipe(gulp.dest(config.DIST_PATH));
});

gulp.task("dist-thumbnail-images", () => {
  gulp.src(config.DEST_PATH + "static/images/thumbnail-*.png")
    .pipe(gulp.dest(config.DIST_PATH + "static/images"));
});

gulp.task("dist-build", done =>
  runSequence("dist-rev-assets", "dist-thumbnail-images", done));

gulp.task("dist-watch", ["watch"], () =>
  gulp.watch(config.DEST_PATH + "**/*", ["dist-rev-assets"]));

gulp.task("dist", ["dist-build", "dist-watch"]);
