export default `
<section data-hook="landing-page">
    {{^loggedIn}}
      <div class="blue">
        <div class="stars"></div>
        <header id="main-header" class="responsive-content-wrapper">
          <h1>
            <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
          </h1>
          {{^isFirefox}}
            <span/>
          {{/isFirefox}}
          {{#isFirefox}}
            <button data-l10n-id="landingFxaAlternateButton" class="button outline" data-hook="signin">Sign in</button>
          {{/isFirefox}}
        </header>
        <div class="split-banner responsive-content-wrapper">
          <div class="copter-wrapper fly-up">
            <div class="copter"></div>
          </div>
          <div class="intro-text">
            <h2 class="banner">
              <span data-l10n-id="landingIntroLead" class="block lead-in">Go beyond...</span>
              <span data-l10n-id="landingIntroOne" class="block">Test new features.</span>
              <span data-l10n-id="landingIntroTwo" class="block">Give us feedback.</span>
              <span data-l10n-id="landingIntroThree" class="block">Help build Firefox.</span>
            </h2>
          </div>
        </div>
        <div class="centered-banner responsive-content-wrapper">
          {{^isFirefox}}
            <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
            <a href="https://www.mozilla.org/en-US/firefox" class="button primary download-firefox">
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
          <button data-l10n-id="landingFxaGetStartedButton" class="button extra-large primary" data-hook="get-started-with-account">Get started with a Firefox Account</button>
          {{/isFirefox}}
        </div>
        {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
        <div class="transparent-container">
          <div class="responsive-content-wrapper delayed-fade-in">
              <h2 class="card-list-header" data-l10n-id="landingExperimentsTitle">Test these features and share your feedback</h2>
              <div data-hook='experiment-list'></div>
          </div>
        </div>
        <div class="responsive-content-wrapper delayed-fade-in">
          <h2 class="card-list-header" data-l10n-id="landingCardListTitle">Get started in 3 easy steps</h2>
          <div id="how-to" class="card-list">
            <div class="card">
              <div class="card-icon firefox-icon"></div>
              <h3 class="card-title" data-l10n-id="landingStepOne">Step one</h3>
              <div class="card-copy" data-l10n-id="landingCardOne">Create a Firefox Account or sign in.</div>
            </div>
            <div class="card">
              <div class="card-icon add-on-icon"></div>
              <h3 class="card-title" data-l10n-id="landingStepTwo">Step two</h3>
              <div class="card-copy" data-l10n-id="landingCardTwo">Get the Test Pilot add-on.</div>
            </div>
            <div class="card">
              <div class="card-icon test-pilot-icon"></div>
              <h3 class="card-title" data-l10n-id="landingStepThree">Step three</h3>
              <div class="card-copy data-l10n-id="landingCardThree">Enable experimental features!</div>
            </div>
          </div>
          <div class="centered-banner">
            {{^isFirefox}}
              <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
              <a href="https://www.mozilla.org/en-US/firefox" class="button primary download-firefox">
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
            <button data-l10n-id="landingFxaGetStartedButton" class="button extra-large primary" data-hook="get-started-with-account">Get started with a Firefox Account</button>
            {{/isFirefox}}
          </div>
        {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
        </div>
        <footer id="main-footer" class="responsive-content-wrapper">
          <div data-hook="footer-view"></div>
        </footer>
      </div>
    {{/loggedIn}}
    {{#loggedIn}}
      <div class="blue">
        <div class="stars"></div>
        <div class="full-page-wrapper space-between">
          <header id="main-header" class="responsive-content-wrapper">
            <h1>
              <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
            </h1>
          </header>
          <div class="centered-banner responsive-content-wrapper">
            <div data-hook="installed-message" class="no-display">
              <h2 data-l10n-id="landingInstallMessage" class="emphasis banner">Test Pilot installed!</h2>
              <a href="/" data-l10n-id="landingInstalledButton" class="button extra-large primary">Choose your features</a>
            </div>
            <div data-hook="default-message">
              <div class="copter-wrapper fly-down">
                <div class="copter"></div>
              </div>
              <h2 class="banner">
                <span data-l10n-id="landingInstallHeader" class="block">Get the add-on to get going!</span>
              </h2>
              <button data-hook="install" class="button extra-large primary">
                <span class="default-btn-msg" data-l10n-id="landingInstallButton">Install Test Pilot</span>
                <span class="no-display progress-btn-msg" data-l10n-id="landingInstallingButton">Installing Test Pilot...</span>
                <div class="state-change-inner"></div>
              </button>
            </div>
          </div>
          <footer id="main-footer" class="responsive-content-wrapper">
            <div data-hook="footer-view"></div>
          </footer>
        </div>
      </div>
    {{/loggedIn}}
</section>
`;
