const gulp = require('gulp');
const config = require('../config.js');
const path = require('path');
const Remarkable = require('remarkable');
const fs = require('fs');
const gutil = require('gulp-util');
const multiDest = require('gulp-multi-dest');
const through = require('through2');
const YAML = require('yamljs');
const ReactDOMServer = require("react-dom/server");

const md = new Remarkable({ html: true });

const THUMBNAIL_FACEBOOK = config.PRODUCTION_URL + '/static/images/thumbnail-facebook.png';
const THUMBNAIL_TWITTER = config.PRODUCTION_URL + '/static/images/thumbnail-twitter.png';
const META_TITLE = 'Firefox Test Pilot';
const META_DESCRIPTION = 'Test new Features. Give us feedback. Help build Firefox.';

gulp.task('pages-misc', () => {
  // We just need a dummy file to get a stream going; we're going to ignore
  // the contents in buildLandingPage
  return gulp.src(config.SRC_PATH + 'pages/*.js')
    .pipe(buildLandingPage())
    .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task('pages-experiments', () => {
  return gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentPage())
    .pipe(gulp.dest(config.DEST_PATH + 'experiments'));
});

gulp.task('pages-compiled', () => {
  return gulp.src(config.SRC_PATH + 'pages/**/*.md')
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
  gulp.watch(config.SRC_PATH + 'generate-static-html.js', ['pages-build', 'pages-compiled']);
  gulp.watch(config.SRC_PATH + 'app.js', ['pages-build']);
  gulp.watch([config.SRC_PATH + 'pages/**/*.md'], ['pages-compiled']);
});

function buildLandingPage() {
  return through.obj(function landingPage(file, enc, cb) {
    const fileName = path.basename(file.history[0]);
    const noExtension = fileName.slice(0, fileName.indexOf('.'));
    const pageModule = path.join('..', 'build', 'static', 'app', fileName);
    const outputPath = noExtension === 'home' ? 'index.html' : noExtension + '/index.html'
    const importedCreate = require(pageModule).default;
    const importedComponent = importedCreate();
    const generateStaticHtml = require('../build/generate-static-html.js');
    const pageContent = generateStaticHtml.generateStaticPage(
      true,
      fileName,
      importedComponent,
      {
        meta_title: META_TITLE,
        meta_description: META_DESCRIPTION,
        canonical_path: '',
        image_facebook: THUMBNAIL_FACEBOOK,
        image_twitter: THUMBNAIL_TWITTER,
        enable_pontoon: config.ENABLE_PONTOON,
        available_locales: config.AVAILABLE_LOCALES
      }
    );
    this.push(new gutil.File({
      path: outputPath,
      contents: new Buffer(pageContent)
    }));
    cb();
  });
}

function buildExperimentPage() {
  return through.obj(function experimentPage(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);
    const generateStaticHtml = require('../build/generate-static-html.js');
    const requiredCreate = require('../build/static/app/experiment.js').default;
    const requiredComponent = requiredCreate(experiment.slug);
    const pageContent = generateStaticHtml.generateStaticPage(
      true,
      'experiment.js',
      requiredComponent,
      {
        meta_title: META_TITLE + ' - ' + experiment.title,
        meta_description: experiment.description,
        canonical_path: 'experiments/' + experiment.slug + '/',
        image_facebook: config.PRODUCTION_URL + experiment.image_facebook ||
          THUMBNAIL_FACEBOOK,
        image_twitter: config.PRODUCTION_URL + experiment.image_twitter ||
          THUMBNAIL_TWITTER,
        enable_pontoon: config.ENABLE_PONTOON,
        available_locales: config.AVAILABLE_LOCALES
      }
    );
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
    .join(',');
}

function convertToCompiledPage() {
  const generateStaticHtml = require('../build/generate-static-html.js');
  return through.obj(function compiledConvert(file, encoding, callback) {
    const p = path.parse(file.path);
    const locale = p.name;
    const page = path.basename(p.dir);
    const pageContent = generateStaticHtml.generateStaticPageFromMarkdown(
      page,
      file.contents.toString(),
      {
        available_locales: availableLanguages(p.dir),
        canonical_path: page,
        meta_title: META_TITLE,
        meta_description: META_DESCRIPTION,
        image_facebook: THUMBNAIL_FACEBOOK,
        image_twitter: THUMBNAIL_TWITTER
      }
    );
    const contents = new Buffer(pageContent);
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
