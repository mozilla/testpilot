module.exports.templateBegin = `
<!doctype html>
<html>
<head>
    <title>Test Pilot</title>
    <link rel="shortcut icon" href="/static/images/favicon.ico">
    <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css">
    <link rel="stylesheet" href="/static/styles/main.css">

    <meta charset="utf-8">
    <meta name="defaultLanguage" content="en-US">
    <meta name="availableLanguages" content="en-US">
    <meta name="viewport" content="width=device-width">
    <link rel="localization" href="/static/locales/{locale}/app.l20n'">

</head>
<body>
  <div data-hook="page-container">
    <div class="flat-blue">
      <div class="shifted-stars"></div>
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
<a data-l10n-id="footerLinkTerms" href="/terms" class="boilerplate">Terms of Use</a>
          <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" class="boilerplate">Cookies</a>
          <a data-l10n-id="footerLinkContribute" href="https://www.mozilla.org/contribute/signup/" class="boilerplate">Contribute</a>
        </div>
      </footer>
    </div>
  </div>
  <script src="https://pontoon.mozilla.org/pontoon.js"></script>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)
    },i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    if (typeof(ga) !== 'undefined') {
        ga('create', 'UA-49796218-34', 'auto');
    } else {
        console.warn(
          'You have google analytics blocked. We understand. Take a ' +
          'look at our privacy policy to see how we handle your data.'
        );
    }
  </script>
</body>
</html>`;
