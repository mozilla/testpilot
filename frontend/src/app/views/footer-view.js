import app from 'ampersand-app';
import BaseView from './base-view';

export default BaseView.extend({
  template: `<div id="footer-links">
                <div class="legal-links">
                  <a href="https://www.mozilla.org" class="mozilla-logo"></a>
                  <a data-l10n-id="footerLinkLegal" href="https://www.mozilla.org/about/legal/" class="boilerplate">Legal</a>
                   <a data-l10n-id="footerLinkPrivacy" href="/privacy" class="boilerplate">Privacy</a>
                  <a data-l10n-id="footerLinkTerms" href="/terms" class="boilerplate">Terms</a>
                  <a data-l10n-id="footerLinkCookies" href="https://www.mozilla.org/privacy/websites/#cookies" class="boilerplate">Cookies</a>
                </div>
                <div class="social-links">
                  <a href="https://github.com/mozilla/testpilot" target="_blank" class="link-icon github" title="GitHub"></a>
                  <a href="https://twitter.com/FxTestPilot" target="_blank" class="link-icon twitter" title="Twitter"></a>
                </div>
             </div>`,

  events: {
    'click .link-icon': 'eventToGA'
  },

  eventToGA(e) {
    const label = e.target.getAttribute('title');
    app.sendToGA('event', {
      eventCategory: 'FooterView Interactions',
      eventAction: 'social link clicked',
      eventLabel: label
    });
  }

});
