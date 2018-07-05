const gulp = require("gulp");
const config = require("../config.js");
const path = require("path");
const fs = require("fs");
const gutil = require("gulp-util");
const multiDest = require("gulp-multi-dest");
const through = require("through2");
const YAML = require("yamljs");
const ReactDOMServer = require("react-dom/server");

import Loading from "../src/app/components/Loading";

import React from "react";
import ReactMarkdown from "react-markdown";

const THUMBNAIL_FACEBOOK = config.PRODUCTION_URL + "/static/images/thumbnail-facebook.png";
const THUMBNAIL_TWITTER = config.PRODUCTION_URL + "/static/images/thumbnail-twitter.png";
const META_TITLE = "Firefox Test Pilot";
const META_DESCRIPTION = "Test new Features. Give us feedback. Help build Firefox.";

// HACK: Ignore non-JS imports used for asset dependencies in Webpack
require.extensions[".scss"] = function() {};
require.extensions[".svg"] = () => "";
require.extensions[".png"] = () => "";
require.extensions[".jpg"] = () => "";

gulp.task("pages-misc", () => {
  // We just need a dummy file to get a stream going; we're going to ignore
  // the contents in buildLandingPage
  return gulp.src(config.SRC_PATH + "pages/index.js")
    .pipe(through.obj(function (file, enc, cb) {
      const pages = require('../src/pages').pages;
      for (const page of pages) {
        this.push(page);
      }
      cb();
    }))
    .pipe(buildLandingPage())
    .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task("pages-experiments", () => {
  return gulp.src(config.CONTENT_SRC_PATH + "experiments/*.yaml")
    .pipe(buildExperimentPage())
    .pipe(gulp.dest(config.DEST_PATH + "experiments"));
});

gulp.task("pages-compiled", () => {
  return gulp.src(config.SRC_PATH + "pages/**/*.md")
             .pipe(convertToCompiledPage())
             .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task("pages-contributing", () => {
  gulp.src("./contribute.json")
    .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task("pages-build", [
  "pages-misc",
  "pages-experiments",
  "pages-contributing",
  "pages-compiled"
]);

gulp.task("pages-watch", () => {
  gulp.watch(config.SRC_PATH + "app.js", ["pages-build"]);
  gulp.watch(config.CONTENT_SRC_PATH + "/**/*.yaml", ["pages-build"]);
  gulp.watch(config.SRC_PATH + "pages/**/*.md", ["pages-compiled"]);
});

function buildLandingPage() {
  return through.obj(function landingPage(page, enc, cb) {
    const name = page[0];
    const outputPath = name === "home" ? "index.html" : name + "/index.html";
    const importedComponent = page[1];
    const pageContent = generateStaticPage(
      true,
      name, "",
      importedComponent,
      {
        meta_title: META_TITLE,
        meta_description: META_DESCRIPTION,
        canonical_path: "",
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
    const requiredCreate = require("../src/pages").experiment;
    const requiredComponent = requiredCreate(experiment.slug);
    const pageContent = generateStaticPage(
      true,
      "experiment", experiment.slug,
      requiredComponent,
      {
        meta_title: META_TITLE + " - " + experiment.title,
        meta_description: experiment.description,
        canonical_path: "experiments/" + experiment.slug + "/",
        image_facebook: config.PRODUCTION_URL + experiment.image_facebook ||
          THUMBNAIL_FACEBOOK,
        image_twitter: config.PRODUCTION_URL + experiment.image_twitter ||
          THUMBNAIL_TWITTER,
        enable_pontoon: config.ENABLE_PONTOON,
        available_locales: config.AVAILABLE_LOCALES
      }
    );
    this.push(new gutil.File({
      path: experiment.slug + "/index.html",
      contents: new Buffer(pageContent)
    }));
    cb();
  });
}

function availableLanguages(path) {
  return fs.readdirSync(path)
    .map(function(f) {
      return f.split(".")[0];
    })
    .join(",");
}

function convertToCompiledPage() {
  return through.obj(function compiledConvert(file, encoding, callback) {
    const p = path.parse(file.path);
    const locale = p.name;
    const page = path.basename(p.dir);
    const noExtension = page.slice(0, page.indexOf("."));
    const pageContent = generateStaticPageFromMarkdown(
      noExtension, "",
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
    if (locale === "en-US") {
      this.push(new gutil.File({
        path: path.join(page, "index.html"),
        contents
      }));
    }
    this.push(new gutil.File({
      path: path.join(page, locale, "index.html"),
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
  let dynamicPageClass = "";
  if (prepareForClient) {
    dynamicRoot = ReactDOMServer.renderToString(dynamicBodyComponent);
    bootstrapScript = '<script src="/static/app/app.js"></script>';
    dynamicPageClass = ' class="dynamic-page"';
  } else if (dynamicBodyComponent) {
    dynamicRoot = ReactDOMServer.renderToStaticMarkup(dynamicBodyComponent);
    bootstrapScript = "";
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
    <link rel="stylesheet" href="/static/app/app.css" />

    <meta name="defaultLanguage" content="en-US" />
    <meta name="availableLanguages" content={ available_locales } />
    <meta name="viewport" content="width=device-width" />

    <link rel="alternate" type="application/atom+xml" href="/feed.atom" title="Atom Feed"/>
    <link rel="alternate" type="application/rss+xml" href="/feed.rss" title="RSS Feed"/>
    <link rel="alternate" type="application/json" href="/feed.json" title="JSON Feed"/>

    <link rel="canonical" href={ `https://testpilot.firefox.com/${canonical_path}` } />

    <title>{ meta_title }</title>

    <meta property="og:type" content="website" />
    <meta property="og:title" content={ meta_title } />
    <meta name="twitter:title" content={ meta_title } />
    <meta name="description" content={ meta_description } />
    <meta property="og:description" content={ meta_description } />
    <meta name="twitter:description" content={ meta_description } />
    <meta name="twitter:card" content="summary" />
    <meta property="og:image" content={ image_facebook } />
    <meta name="twitter:image" content={ image_twitter } />
    <meta property="og:url" content={ `https://testpilot.firefox.com/${canonical_path}` } />
  </head>;

  const bodyComponent = <div id="static-root">
    <noscript>
      <div className="full-page-wrapper centered">
        <div className="layout-wrapper layout-wrapper--column-center">
          <p>Test Pilot zahteva JavaScript. Žal nam je.</p>
          <p>Test Pilot vyžaduje JavaScript. Ospravedlňujeme sa za problémy.</p>
          <p>Test Pilot fereasket JavaScript. Sorry derfoar.</p>
          <p>Test Pilot lyp JavaScript. Na ndjeni për këtë.</p>
          <p>Test Pilot memerlukan JavaScript. Harap maaf.</p>
          <p>Test Pilot krev JavaScript. Lei for det.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos.</p>
          <p>Testpilot kræver JavaScript. Beklager.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos por ello.</p>
          <p>Test Pilot を使うには JavaScript が必要です。申し訳ありません</p>
          <div className="copter">
            <div className="copter__inner"></div>
          </div>
          <p>Το Test Pilot απαιτεί JavaScript. Λυπούμαστε γι' αυτό.</p>
          <p>Test Pilot requiere JavaScript. Disculpe</p>
          <p>Siamo spiacenti, Test Pilot richiede JavaScript.</p>
          <p>Omlouváme se, ale Test Pilot vyžaduje JavaScript.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos.</p>
          <p>Для работы Лётчика-испытателя необходимо включить JavaScript. Извините.</p>
          <p>Je nam žel, ale TestPilot sej JavaScript wužaduje.</p>
          <p>Ri Test Pilot nrajo' JavaScript. Kojakuyu'.</p>
          <p>很抱歉，Test Pilot 需要 JavaScript 来运行。</p>
          <p>Вибачте, але для роботи Test Pilot необхідний JavaScript.</p>
          <p>Test Pilot захтева JavaScript. Жао нам је због овога.</p>
          <p>O Test Pilot requer JavaScript. Pedimos desculpa.</p>
          <p>Test Pilot zahtjeva JavaScript. Žao nam je zbog toga.</p>
          <p>很抱歉，需要開啟 JavaScript 才能使用 Test Pilot</p>
          <p>Desculpe, o Test Pilot requer JavaScript.</p>
          <p>A Tesztpilótához JavaScript szükséges. Sajnáljuk.</p>
          <p>Test Pilot vereist JavaScript. Sorry daarvoor.</p>
          <p>Test Pilot საჭიროებს JavaScript-ს. ვწუხვართ, ამის გამო.</p>
          <p>Test Pilot benötigt JavaScript. Das tut uns leid.</p>
          <p>Test Pilot을 쓰려면 JavaScript가 필요합니다. 죄송합니다.</p>
          <p>Désolé, Test Pilot nécessite JavaScript.</p>
          <p>Test Pilot kräver JavaScript. Ledsen för det.</p>
          <p>Mae Test Pilot angen JavaScript. Ymddiheuriadau.</p>
          <p>Test Pilot requires JavaScript. Sorry about that.</p>
          <p>Jo nam luto, ale TestPilot se JavaScript pomina.</p>
          <p>Test Pilotu için JavaScript şarttır. Kusura bakmayın.</p>
          <p>Test Pilot vereist JavaScript. Sorry daarvoor.</p>
          <p>Test Pilot საჭიროებს JavaScript-ს. ვწუხვართ, ამის გამო.</p>
          <p>Test Pilot benötigt JavaScript. Das tut uns leid.</p>
          <p>Test Pilot을 쓰려면 JavaScript가 필요합니다. 죄송합니다.</p>
          <p>Désolé, Test Pilot nécessite JavaScript.</p>
          <p>Test Pilot kräver JavaScript. Ledsen för det.</p>
          <p>Mae Test Pilot angen JavaScript. Ymddiheuriadau.</p>
          <p>Test Pilot requires JavaScript. Sorry about that.</p>
          <p>Jo nam luto, ale TestPilot se JavaScript pomina.</p>
          <p>Test Pilotu için JavaScript şarttır. Kusura bakmayın.</p>
        </div>
      </div>
    </noscript>
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

      <div className="header-links">
        <a className="blog-link" href="https://medium.com/firefox-test-pilot" target="_blank" rel="noopener noreferrer">Blog</a>
      </div>
    </header>
    <div className="layout-wrapper static-page-content">
      <ReactMarkdown source={ markdown } />
    </div>

    <footer id="main-footer">
      <div id="footer-links" className="layout-wrapper layout-wrapper--row-bottom-breaking">
        <div className="legal-links">
          <a href="https://www.mozilla.org" className="mozilla-logo" alt="Mozilla Site"></a>
          <a href="https://www.mozilla.org/about/legal/" className="boilerplate">Legal</a>
          <a href="https://qsurvey.mozilla.com/s3/test-pilot-general-feedback" className="boilerplate">Give Feedback</a>
          <a href="/about" className="boilerplate">About Test Pilot</a>
          <a href="/privacy" className="boilerplate">Privacy</a>
          <a href="/terms" className="boilerplate">Terms</a>
          <a href="https://www.mozilla.org/privacy/websites/#cookies" className="boilerplate">Cookies</a>
        </div>
        <div className="social-links">
          <a href="https://github.com/mozilla/testpilot" target="_blank" title="GitHub" className="link-icon github" alt="Testpilot GitHub Repo"></a>
          <a href="https://twitter.com/FxTestPilot" target="_blank" title="Twitter" className="link-icon twitter" alt="Testpilot Twitter"></a>
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
