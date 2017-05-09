
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

function makeStaticString(
  prepareForClient, componentName, headComponent,
  staticBodyComponent, dynamicBodyComponent
) {
  const head = ReactDOMServer.renderToStaticMarkup(headComponent);
  const staticRoot = ReactDOMServer.renderToStaticMarkup(staticBodyComponent);
  let dynamicRoot;
  let bootstrapScript;
  if (prepareForClient) {
    dynamicRoot = ReactDOMServer.renderToString(dynamicBodyComponent);
    bootstrapScript = '<script src="/static/app/app.js"></script>';
  } else if (dynamicBodyComponent) {
    dynamicRoot = ReactDOMServer.renderToStaticMarkup(dynamicBodyComponent);
    bootstrapScript = '';
  }
  return `<!DOCTYPE html>
<html>
  ${head}
  <body class="blue">
    <div class="stars"></div>
    ${staticRoot}
    <div id="page-container">${dynamicRoot}</div>
    ${bootstrapScript}
  </body>
</html>`;
}

// TODO XXX Export two functions, generateStaticPage, and prerenderDynamicComponent
export function generateStaticPage(prepareForClient, name, component, {
  available_locales, canonical_path, meta_title, meta_description,
  image_facebook, image_twitter, enable_pontoon
}) {
  const headComponent = <head>
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/images/favicon.ico" />
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css" />
    <link rel="stylesheet" href="/static/styles/main.css" />

    <meta name="defaultLanguage" content="en-US" />
    <meta name="availableLanguages" content={ available_locales } />
    <meta name="viewport" content="width=device-width" />

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
    <meta property="og:url" content="https://testpilot.firefox.com" />
  </head>;
  const bodyComponent = <div>
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
    { prepareForClient ? <script src="/static/app/vendor.js"></script> : null }
    { enable_pontoon ? <script src="https://pontoon.mozilla.org/pontoon.js"></script> : null }
  </div>;

  return makeStaticString(prepareForClient, name, headComponent, bodyComponent, component);
}

export function generateStaticPageFromMarkdown(name, markdown, params) {
  const body = <div className="full-page-wrapper">
    <header id="main-header" className="layout-wrapper layout-wrapper--row-between-top">
      <h1>
        <a href="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
      </h1>
    </header>
    <div className="layout-wrapper static-page-content">
      <ReactMarkdown source={ markdown } />
    </div>

    <footer id="main-footer">
      <div id="footer-links" className="layout-wrapper layout-wrapper--row-bottom-breaking">
        <div className="legal-links">
          <a href="https://www.mozilla.org" className="mozilla-logo"></a>
          <a data-l10n-id="footerLinkLegal" href="https://www.mozilla.org/about/legal/" className="boilerplate">Legal</a>
          <a data-l10n-id="footerLinkAbout" href="/about" className="boilerplate">About Test Pilot</a>
          <a data-l10n-id="footerLinkPrivacy" href="/privacy" className="boilerplate">Privacy</a>
          <a data-l10n-id="footerLinkTerms" href="/terms" className="boilerplate">Terms</a>
          <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" className="boilerplate">Cookies</a>
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
    false, 'markdown.js', body, JSON.stringify(markdown), params
  );
}
