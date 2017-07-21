const gulp = require('gulp');
const config = require('../config.js');
const path = require('path');
const fs = require('fs');
const gutil = require('gulp-util');
const multiDest = require('gulp-multi-dest');
const through = require('through2');
const YAML = require('yamljs');
const ReactDOMServer = require('react-dom/server');

import Loading from '../src/app/components/Loading';

import React from 'react';
import ReactMarkdown from 'react-markdown';

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
  gulp.watch(config.SRC_PATH + 'app.js', ['pages-build']);
  gulp.watch(config.CONTENT_SRC_PATH + '/**/*.yaml', ['pages-build']);
  gulp.watch(config.SRC_PATH + 'pages/**/*.md', ['pages-compiled']);
});

function buildLandingPage() {
  return through.obj(function landingPage(file, enc, cb) {
    const fileName = path.basename(file.history[0]);
    const noExtension = fileName.slice(0, fileName.indexOf('.'));
    const pageModule = path.join('..', 'src', 'pages', fileName);
    const outputPath = noExtension === 'home' ? 'index.html' : noExtension + '/index.html'
    const importedCreate = require(pageModule).default;
    const importedComponent = importedCreate();
    const pageContent = generateStaticPage(
      true,
      noExtension, '',
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
    const requiredCreate = require('../src/pages/experiment.js').default;
    const requiredComponent = requiredCreate(experiment.slug);
    const pageContent = generateStaticPage(
      true,
      'experiment', experiment.slug,
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
  return through.obj(function compiledConvert(file, encoding, callback) {
    const p = path.parse(file.path);
    const locale = p.name;
    const page = path.basename(p.dir);
    const noExtension = page.slice(0, page.indexOf('.'));
    const pageContent = generateStaticPageFromMarkdown(
      noExtension, '',
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

function makeStaticString(
  prepareForClient, pageName, pageParam, headComponent,
  staticBodyComponent, dynamicBodyComponent
) {
  const head = ReactDOMServer.renderToStaticMarkup(headComponent);
  const staticRoot = ReactDOMServer.renderToStaticMarkup(staticBodyComponent);
  let dynamicRoot;
  let bootstrapScript;
  let dynamicPageClass = '';
  if (prepareForClient) {
    dynamicRoot = ReactDOMServer.renderToString(dynamicBodyComponent);
    bootstrapScript = '<script src="/static/app/app.js"></script>';
    dynamicPageClass = ' class="dynamic-page"';
  } else if (dynamicBodyComponent) {
    dynamicRoot = ReactDOMServer.renderToStaticMarkup(dynamicBodyComponent);
    bootstrapScript = '';
  }
  return `<!DOCTYPE html>
<html>
  ${head}
  <body class="blue" data-page-name="${pageName}" data-page-param="${pageParam}">
    <div class="stars"></div>
    ${staticRoot}
    <div id="page-container"${dynamicPageClass}>${dynamicRoot}</div>
    ${bootstrapScript}
  </body>
</html>`;
}

function generateStaticPage(prepareForClient, pageName, pageParam, component, {
  available_locales, canonical_path, meta_title, meta_description,
  image_facebook, image_twitter, enable_pontoon
}) {
  const headComponent = <head>
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/images/favicon.ico" />
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css" />
    <link rel="stylesheet" href="/static/styles/experiments.css" />
    <link rel="stylesheet" href="/static/styles/main.css" />

    <meta name="defaultLanguage" content="en-US" />
    <meta name="availableLanguages" content={ available_locales } />
    <meta name="viewport" content="width=device-width" />

    <link rel="alternate" type="application/atom+xml" href="/feed.atom" title="Atom Feed"/>
    <link rel="alternate" type="application/rss+xml" href="/feed.rss" title="RSS Feed"/>
    <link rel="alternate" type="application/json" href="/feed.json" title="JSON Feed"/>

    <link rel="canonical" href={ `https://testpilot.firefox.com/${canonical_path}` } />

    <title>{ meta_title }</title>

    <meta property="og:title" content={ meta_title } />
    <meta name="twitter:title" content={ meta_title } />
    <meta name="description" content={ meta_description } />
    <meta property="og:description" content={ meta_description } />
    <meta name="twitter:description" content={ meta_description } />
    <meta name="twitter:card" content="summary" />
    <meta property="og:image" content={ image_facebook } />
    <meta name="twitter:image" content={ image_twitter } />
    <meta property="og:url" content="https://testpilot.firefox.com" />
  </head>;

  const bodyComponent = <div id="static-root">
    <noscript>
      <div className="full-page-wrapper centered">
        <div className="layout-wrapper layout-wrapper--column-center">
          <div id="four-oh-four" className="modal delayed-fade-in">
            <h1 className="title">Uh oh...</h1>
            <div className="modal-content">
              <p>Test Pilot requires JavaScript.<br />Sorry about that.</p>
            </div>
            <div className="modal-actions">
              <a className="button default large" href="https://github.com/mozilla/testpilot/blob/master/docs/faq.md">Find out why</a>
            </div>
          </div>
          <div className="copter">
            <div className="copter__inner"></div>
          </div>
        </div>
      </div>
    </noscript>
    { prepareForClient ? <Loading /> : null }
    { prepareForClient ? <script src="/static/app/vendor.js"></script> : null }
  </div>;

  return makeStaticString(prepareForClient, pageName, pageParam, headComponent, bodyComponent, component);
}

function generateStaticPageFromMarkdown(pageName, pageParam, markdown, params) {
  const body = <div className="full-page-wrapper">
    <header id="main-header" className="layout-wrapper layout-wrapper--row-between-top">
      <h1>
        <a href="/" className="wordmark">Firefox Test Pilot</a>
      </h1>
    </header>
    <div className="layout-wrapper static-page-content">
      <ReactMarkdown source={ markdown } />
    </div>

    <footer id="main-footer">
      <div id="footer-links" className="layout-wrapper layout-wrapper--row-bottom-breaking">
        <div className="legal-links">
          <a href="https://www.mozilla.org" className="mozilla-logo"></a>
          <a href="https://www.mozilla.org/about/legal/" className="boilerplate">Legal</a>
          <a href="/about" className="boilerplate">About Test Pilot</a>
          <a href="/privacy" className="boilerplate">Privacy</a>
          <a href="/terms" className="boilerplate">Terms</a>
          <a href="https://www.mozilla.org/privacy/websites/#cookies" className="boilerplate">Cookies</a>
        </div>
        <div className="social-links">
          <a href="https://github.com/mozilla/testpilot" target="_blank" title="GitHub" className="link-icon github"></a>
          <a href="https://twitter.com/FxTestPilot" target="_blank" title="Twitter" className="link-icon twitter"></a>
        </div>
      </div>
    </footer>
    <script src="/static/app/vendor.js"></script>
    <script src="/static/scripts/locale.js"></script>
    <script src="/static/scripts/legal.js"></script>
  </div>;

  return generateStaticPage(
    false, pageName, pageParam, body, params
  );
}
