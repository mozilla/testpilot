
import React from 'react';
import ReactDOMServer from 'react-dom/server';


function makeStaticString(headComponent, bodyComponent) {
  const head = ReactDOMServer.renderToStaticMarkup(headComponent);
  const root = ReactDOMServer.renderToStaticMarkup(bodyComponent);
  return `<!DOCTYPE html>
<html>
  ${head}
  <body class="blue">
    <div id="page-container">${root}</div>
  </body>
</html>`;
}

export function generateStaticPage({
  available_locales, canonical_path,
  meta_title, meta_description, image_facebook, image_twitter, enable_pontoon
}) {
  const headComponent = <head>
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/images/favicon.ico" />
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css" />
    <link rel="stylesheet" href="/static/styles/main.css" />

    <meta name="defaultLanguage" content="en-US" />
    <meta name="availableLanguages" content={ available_locales } />
    <meta name="viewport" content="width=device-width" />

    <link rel="localization" href="/static/locales/en-US/app.ftl" />
    <link rel="localization" href="/static/locales/en-US/experiments.ftl" />
    <link rel="localization" href="/static/locales/{locale}/app.ftl" />
    <link rel="localization" href="/static/locales/{locale}/experiments.ftl" />

    <link rel="canonical" href={ `https://testpilot.firefox.com/${canonical_path}` } />

    <title data-l10n-id="pageTitleDefault">{ meta_title }</title>

    <meta property="og:title" content={ meta_title } />
    <meta name="twitter:title" content={ meta_title } />
    <meta name="description" content={ meta_description } />
    <meta property="og:description" content={ meta_description } />
    <meta name="twitter:description" content={ meta_description } />
    <meta name="twitter:card" content="summary" />
    <meta property="og:image" content={ image_facebook } />
    <meta name="twitter:image" content={ image_twitter } />
  </head>;
  const bodyComponent = <div>
    <div className="stars"></div>
    <noscript>
      <div className="full-page-wrapper centered">
        <div className="layout-wrapper layout-wrapper--column-center">
          <div id="four-oh-four" className="modal delayed-fade-in">
            <h1 data-l10n-id="noScriptHeading" className="title">Uh oh...</h1>
            <div className="modal-content">
              <p data-l10n-id="noScriptMessage">Test Pilot requires JavaScript.<br />Sorry about that.</p>
            </div>
            <div className="modal-actions">
              <a data-l10n-id="noScriptLink" className="button default large" href="https://github.com/mozilla/testpilot/blob/master/docs/faq.md">Find out why</a>
            </div>
          </div>
          <div className="copter">
            <div className="copter__inner"></div>
          </div>
        </div>
      </div>
    </noscript>
    <div className="full-page-wrapper centered overflow-hidden">
      <div className="loader">
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
      </div>
    </div>
    <script src="/static/app/vendor.js"></script>
    <script src="/static/app/app.js"></script>
    { enable_pontoon ? <script src="https://pontoon.mozilla.org/pontoon.js"></script> : null }
  </div>;

  return makeStaticString(headComponent, bodyComponent);
}
