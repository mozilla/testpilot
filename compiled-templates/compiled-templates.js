module.exports.render = function (options) {
  return `
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/static/images/favicon.ico">
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css">
    <link rel="stylesheet" href="/static/styles/main.css">
    <meta name="defaultLanguage" content="${options.defaultLanguage}">
    <meta name="availableLanguages" content="${options.availableLanguages}">
    <meta name="viewport" content="width=device-width">
    <link rel="localization" href="/static/locales/{locale}/app.ftl">

    <title>Firefox Test Pilot</title>

    <link rel="canonical" href="http://testpilot.firefox.com/">
    <meta name="description" content="Test new Features. Give us feedback. Help build Firefox." />
    <meta property="og:description" content="Test new Features. Give us feedback. Help build Firefox." />
    <meta property="og:image" content="http://testpilot.firefox.com/static/images/thumbnail-facebook.1a45270b.png" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="Firefox Test Pilot" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://testpilot.firefox.com/" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:description" content="Test new Features. Give us feedback. Help build Firefox." />
    <meta name="twitter:image" content="http://testpilot.firefox.com/static/images/thumbnail-twitter.19ccbdd2.png" />
    <meta name="twitter:site" content="@FxTestPilot" />
    <meta name="twitter:title" content="Firefox Test Pilot" />
</head>
<body class="blue">
  <div class="stars"></div>
  <div class="full-page-wrapper space-between"/>
   <header id="main-header" class="responsive-content-wrapper">
      <h1>
        <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
      </h1>
    </header>
    <div class="responsive-content-wrapper static-page-content">
    ${options.body}
    </div>

    <footer id="main-footer" class="responsive-content-wrapper">
      <div id="footer-links">
        <div class="legal-links">
          <a href="https://www.mozilla.org" class="mozilla-logo"></a>
          <a data-l10n-id="footerLinkLegal" href="https://www.mozilla.org/about/legal/" class="boilerplate">Legal</a>
          <a data-l10n-id="footerLinkAbout" href="/about" className="boilerplate">About Test Pilot</a>
          <a data-l10n-id="footerLinkPrivacy" href="/privacy" class="boilerplate">Privacy</a>
          <a data-l10n-id="footerLinkTerms" href="/terms" class="boilerplate">Terms</a>
          <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" class="boilerplate">Cookies</a>
        </div>
        <div class="social-links">
          <a href="https://github.com/mozilla/testpilot" target="_blank" title="GitHub" class="link-icon github"></a>
          <a href="https://twitter.com/FxTestPilot" target="_blank" title="Twitter" class="link-icon twitter"></a>
        </div>
      </div>
    </footer>
  </div>
  <script src="/static/app/vendor.js"></script>
  <script src="/static/scripts/locale.js"></script>
  <script src="/static/scripts/legal.js"></script>
</body>
</html>`;
}
