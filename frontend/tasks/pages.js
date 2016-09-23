const gulp = require('gulp');
const config = require('../config.js');

const Remarkable = require('remarkable');
const fs = require('fs');
const gutil = require('gulp-util');
const multiDest = require('gulp-multi-dest');
const through = require('through2');
const Mustache = require('mustache');
const YAML = require('yamljs');

const md = new Remarkable({html: true});

const indexTemplate = fs.readFileSync(config.SRC_PATH + 'templates/index.mustache').toString();
const legalTemplates = require('../../legal-copy/legal-templates');

const legalPagePaths = {
  'privacy-notice.md': 'privacy/index.html',
  'terms-of-use.md': 'terms/index.html'
};

const THUMBNAIL_FACEBOOK = 'https://testpilot.firefox.com/static/images/thumbnail-facebok.png';
const THUMBNAIL_TWITTER = 'https://testpilot.firefox.com/static/images/thumbnail-twitter.png';

gulp.task('pages-misc', () => {
  return gulp.src(config.SRC_PATH + 'templates/index.mustache')
    .pipe(buildLandingPage())
    .pipe(multiDest([
      '', 'experiments', 'onboarding', 'home', 'share', 'legacy', 'error', 'retire'
    ].map(path => config.DEST_PATH + path)))
});

gulp.task('pages-experiments', () => {
  return gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentPage())
    .pipe(gulp.dest(config.DEST_PATH + 'experiments'));
});

gulp.task('pages-legal', () => {
  return gulp.src('./legal-copy/*.md')
             .pipe(convertToLegalPage())
             .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task('pages-build', [
  'pages-misc',
  'pages-experiments',
  'pages-legal'
]);

gulp.task('pages-watch', () => {
  gulp.watch(config.SRC_PATH + 'index.html', ['pages-generate']);
  gulp.watch(['./legal-copy/*.md', './legal-copy/*.js'], ['pages-legal']);
});

function buildLandingPage() {
  return through.obj(function experimentPage(file, enc, cb) {
    const template = file.contents.toString();
    const pageContent = Mustache.render(template, {
      meta_title: 'Firefox Test Pilot',
      meta_description: 'Test new Features. Give us feedback. Help build Firefox.',
      canonical_path: '',
      image_facebook: THUMBNAIL_FACEBOOK,
      image_twitter: THUMBNAIL_TWITTER,
      enable_pontoon: config.ENABLE_PONTOON
    });
    this.push(new gutil.File({
      path: 'index.html',
      contents: new Buffer(pageContent)
    }));
    cb();
  });
}

function buildExperimentPage() {
  return through.obj(function experimentPage(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);
    const pageContent = Mustache.render(indexTemplate, {
      meta_title: 'Firefox Test Pilot - ' + experiment.title,
      meta_description: experiment.description,
      canonical_path: 'experiments/' + experiment.slug + '/',
      image_facebook: experiment.image_facebook || THUMBNAIL_FACEBOOK,
      image_twitter: experiment.image_twitter || THUMBNAIL_TWITTER,
      enable_pontoon: config.ENABLE_PONTOON
    });
    this.push(new gutil.File({
      path: experiment.slug + '/index.html',
      contents: new Buffer(pageContent)
    }));
    cb();
  });
}

function convertToLegalPage() {
  return through.obj(function legalConvert(file, encoding, callback) {
    const filename = file.path.split('/').pop();
    this.push(new gutil.File({
      path: legalPagePaths[filename],
      contents: new Buffer(`${legalTemplates.templateBegin}
                            ${md.render(file.contents.toString())}
                            ${legalTemplates.templateEnd}`)
    }));
    callback();
  });
}
