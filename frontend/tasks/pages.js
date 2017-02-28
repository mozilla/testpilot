const gulp = require('gulp');
const config = require('../config.js');
const path = require('path');
const Remarkable = require('remarkable');
const fs = require('fs');
const gutil = require('gulp-util');
const multiDest = require('gulp-multi-dest');
const through = require('through2');
const Mustache = require('mustache');
const YAML = require('yamljs');

const md = new Remarkable({ html: true });

const indexTemplate = fs.readFileSync(config.SRC_PATH + 'templates/index.mustache').toString();
const compiledTemplates = require('../../compiled-templates/compiled-templates');

const THUMBNAIL_FACEBOOK = config.PRODUCTION_URL + '/static/images/thumbnail-facebook.png';
const THUMBNAIL_TWITTER = config.PRODUCTION_URL + '/static/images/thumbnail-twitter.png';

gulp.task('pages-misc', () => {
  return gulp.src(config.SRC_PATH + 'templates/index.mustache')
    .pipe(buildLandingPage())
    .pipe(multiDest([
      '', 'experiments', 'onboarding', 'home', 'share', 'legacy', 'error', 'retire'
    ].map(path => config.DEST_PATH + path)));
});

gulp.task('pages-experiments', () => {
  return gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentPage())
    .pipe(gulp.dest(config.DEST_PATH + 'experiments'));
});

gulp.task('pages-compiled', () => {
  return gulp.src('./compiled-templates/**/*.md')
             .pipe(convertToCompiledPage())
             .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task('pages-contributing', () => {
  gulp.src('./contribute.json')
    .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task('pages-build', [
  'pages-misc',
  'pages-experiments',
  'pages-contributing',
  'pages-compiled'
]);

gulp.task('pages-watch', () => {
  gulp.watch(config.SRC_PATH + 'templates/index.mustache', ['pages-build']);
  gulp.watch(['./compiled-templates/*.md', './compiled-templates/*.js'], ['pages-compiled']);
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
      enable_pontoon: config.ENABLE_PONTOON,
      available_locales: config.AVAILABLE_LOCALES
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
      image_facebook: config.PRODUCTION_URL + experiment.image_facebook ||
        THUMBNAIL_FACEBOOK,
      image_twitter: config.PRODUCTION_URL + experiment.image_twitter ||
        THUMBNAIL_TWITTER,
      enable_pontoon: config.ENABLE_PONTOON,
      available_locales: config.AVAILABLE_LOCALES
    });
    this.push(new gutil.File({
      path: experiment.slug + '/index.html',
      contents: new Buffer(pageContent)
    }));
    cb();
  });
}

function availableLanguages(path) {
  return fs.readdirSync(path)
    .map(function (f) {
      return f.split('.')[0]
    })
    .join(',')
}

function convertToCompiledPage() {
  return through.obj(function compiledConvert(file, encoding, callback) {
    const p = path.parse(file.path);
    const locale = p.name;
    const page = path.basename(p.dir);
    const contents = new Buffer(
      compiledTemplates.render({
        defaultLanguage: 'en-US',
        availableLanguages: availableLanguages(p.dir),
        body: md.render(file.contents.toString())
      })
    );
    if (locale === 'en-US') {
      this.push(new gutil.File({
        path: path.join(page, 'index.html'),
        contents
      }));
    }
    this.push(new gutil.File({
      path: path.join(page, locale, 'index.html'),
      contents
    }));
    callback();
  });
}
