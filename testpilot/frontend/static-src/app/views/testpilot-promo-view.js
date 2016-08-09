import BaseView from './base-view';


export default BaseView.extend({
  _template: `
    <div class="experiment-promo">
      <div class="reverse-split-banner responsive-git content-wrapper">
        <div class="copter-wrapper fly-up">
          <div class="copter"></div>
        </div>
        <div class="intro-text">
          <h2 class="banner">
            <span data-l10n-id="experimentPromoHeader" class="block">Ready for Takeoff?</span>
          </h2>
          <p data-l10n-id="experimentPromoSubheader">We're building next-generation features for Firefox. Install Test Pilot to try them!</p>
          {{^isFirefox}}
            <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
            <a href="https://www.mozilla.org/firefox" class="button primary download-firefox">
              <div class="button-icon">
                <div class="button-icon-badge"></div>
              </div>
              <div class="button-copy">
                <div data-l10n-id="landingDownloadFirefoxTitle" class="button-title">Firefox</div>
                <div data-l10n-id="landingDownloadFirefoxSubTitle" class="button-description">Free Download</div>
              </div>
            </a>
          {{/isFirefox}}
          {{#isFirefox}}
          <button data-hook="install" class="button extra-large primary">
            <span class="default-btn-msg" data-l10n-id="landingInstallButton">Install the Test Pilot Add-on</span>
            <span class="no-display progress-btn-msg" data-l10n-id="landingInstallingButton">Installing...</span>
            <div class="state-change-inner"></div>
          </button>
          <p data-l10n-id="landingLegalNotice" class="legal-information">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>
          {{/isFirefox}}
        </div>
      </div>
    </div>
  `,

  props: {
    isFirefox: 'boolean'
  }
});
