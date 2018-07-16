const gulp = require("gulp");
const config = require("../config.js");
const path = require("path");
const fs = require("fs");
const gutil = require("gulp-util");
const through = require("through2");
const YAML = require("yamljs");
const ReactDOMServer = require("react-dom/server");

import React from "react";
import ReactMarkdown from "react-markdown";

import LayoutWrapper from "../src/app/components/LayoutWrapper";
import Head from "../src/app/components/Head";
import Footer from "../src/app/components/Footer";
import NoScript from "../src/app/components/NoScript";

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
  const headComponent = <Head
    metaTitle={meta_title}
    metaDescription={meta_description}
    canonicalPath={canonical_path}
    availableLocales={available_locales}
    imageFacebook={image_facebook}
    imageTwitter={image_twitter}
  />;

  const bodyComponent = <div id="static-root">
    <NoScript />
    {prepareForClient ? <script src="/static/app/vendor.js"></script> : null}
  </div>;

  return makeStaticString(prepareForClient, pageName, pageParam, headComponent, bodyComponent, component);
}

function generateStaticPageFromMarkdown(pageName, pageParam, markdown, params) {
  // TODO: Reuse Header component
  const body = <div className="full-page-wrapper">
    <header id="main-header" className="layout-wrapper layout-wrapper--row-between-top">
      <h1>
        <a href="/" className="wordmark">Firefox Test Pilot</a>
      </h1>

      <div className="header-links">
        <a className="blog-link" href="https://medium.com/firefox-test-pilot" target="_blank" rel="noopener noreferrer">Blog</a>
      </div>
    </header>

    <LayoutWrapper helperClass="static-page-content">
      <ReactMarkdown source={markdown} />
    </LayoutWrapper>

    <Footer />
    <script src="/static/app/vendor.js"></script>
    <script src="/static/scripts/locale.js"></script>
    <script src="/static/scripts/legal.js"></script>
  </div>;

  return generateStaticPage(
    false, pageName, pageParam, body, params
  );
}
