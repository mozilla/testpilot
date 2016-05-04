import BaseView from './base-view';

export default BaseView.extend({
  template: `<div id="footer-links">
                 <a href="https://www.mozilla.org" class="mozilla-logo"></a>
                 <a data-l10n-id="footerLinkLegal" href="https://www.mozilla.org/about/legal/" class="boilerplate">Legal</a>
                 <a data-l10n-id="footerLinkPrivacy" href="/privacy" class="boilerplate">Privacy</a>
                 <a data-l10n-id="footerLinkTerms" href="/terms" class="boilerplate">Terms of Use</a>
                 <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" class="boilerplate">Cookies</a>
                 <a data-l10n-id="footerLinkContribute" href="https://www.mozilla.org/contribute/signup/" class="boilerplate">Contribute</a>
             </div>`
});
