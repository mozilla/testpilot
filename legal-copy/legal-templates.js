module.exports.templateBegin = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Firefox Test Pilot</title>
    <link rel="shortcut icon" href="/static/images/favicon.ico">
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css">
    <link rel="stylesheet" href="/static/styles/main.css">

    <meta name="defaultLanguage" content="en-US">
    <meta name="availableLanguages" content="en-US">
    <meta name="viewport" content="width=device-width">
    <link rel="localization" href="/static/locales/{locale}/app.l20n">
</head>
<body>
  <div data-hook="page-container" class="legal-container">
    <div class="shifted-stars">
      <header id="main-header" class="responsive-content-wrapper">
          <h1>
            <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
          </h1>
        </header>
    </div>
    <div class="full-page-wrapper space-between">
      <div class="responsive-content-wrapper">`,

module.exports.templateEnd = `
      </div>
      <footer id="main-footer" class="responsive-content-wrapper">
        <div id="footer-links">
          <a href="https://www.mozilla.org" class="mozilla-logo"></a>
          <a data-l10n-id="footerLinkLegal" href="https://www.mozilla.org/about/legal/" class="boilerplate">Legal</a>
<a data-l10n-id="footerLinkPrivacy" href="/privacy" class="boilerplate">Privacy</a>
<a data-l10n-id="footerLinkTerms" href="/terms" class="boilerplate">Terms</a>
          <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" class="boilerplate">Cookies</a>
          <a data-l10n-id="footerLinkContribute" href="https://www.mozilla.org/contribute/signup/" class="boilerplate">Contribute</a>
        </div>
      </footer>
    </div>
  </div>
  <script src="/static/scripts/legal.js"></script>
</body>
</html>`;
