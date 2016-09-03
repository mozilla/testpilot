export default `
<section data-hook="landing-page">
  <header id="main-header" class="responsive-content-wrapper">
    <h1>
      <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
    </h1>
  </header>
  <div class="split-banner responsive-content-wrapper">
    <div class="copter-wrapper fly-up">
      <div class="copter"></div>
    </div>
    <div class="intro-text">
      <h2 class="banner">
        <span data-l10n-id="landingIntroLead" class="block lead-in">Go beyond . . . </span>
        <span data-l10n-id="landingIntroOne" class="block">Test new features.</span>
        <span data-l10n-id="landingIntroTwo" class="block">Give your feedback.</span>
        <span data-l10n-id="landingIntroThree" class="block">Help build Firefox.</span>
      </h2>
    </div>
  </div>
  <div class="centered-banner responsive-content-wrapper">
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
    <button data-hook="install" class="button extra-large primary install">
      <span class="default-btn-msg" data-l10n-id="landingInstallButton">Install the Test Pilot Add-on</span>
      <span class="no-display progress-btn-msg" data-l10n-id="landingInstallingButton">Installing...</span>
      <div class="state-change-inner"></div>
    </button>
    {{/isFirefox}}
  </div>
  {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
  <div class="transparent-container">
    <div class="responsive-content-wrapper delayed-fade-in">
        <h2 class="card-list-header" data-l10n-id="landingExperimentsTitle">Try out the latest experimental features</h2>
        <div data-hook='experiment-list'></div>
    </div>
  </div>
  <div class="responsive-content-wrapper delayed-fade-in">
    <h2 class="card-list-header" data-l10n-id="landingCardListTitle">Get started in 3 easy steps</h2>
    <div id="how-to" class="card-list">
      <div class="card">
        <div class="card-icon add-on-icon large"></div>
        <div class="card-copy large" data-l10n-id="landingCardOne">Get the Test Pilot add-on</div>
      </div>
      <div class="card">
        <div class="card-icon test-pilot-icon large"></div>
        <div class="card-copy large" data-l10n-id="landingCardTwo">Enable experimental features</div>
      </div>
      <div class="card">
        <div class="card-icon chat-icon large"></div>
        <div class="card-copy large" data-l10n-id="landingCardThree">Tell us what you think</div>
      </div>
    </div>
    <div class="centered-banner">
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
        <div class="small-spacer"></div>
        <button data-hook="install" class="button extra-large primary install">
          <span class="default-btn-msg" data-l10n-id="landingInstallButton">Install the Test Pilot Add-on</span>
          <span class="no-display progress-btn-msg" data-l10n-id="landingInstallingButton">Installing...</span>
          <div class="state-change-inner"></div>
        </button>
      {{/isFirefox}}
    </div>
  {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
  </div>
  <footer id="main-footer" class="responsive-content-wrapper">
    <div data-hook="footer-view"></div>
  </footer>
</section>
`;
