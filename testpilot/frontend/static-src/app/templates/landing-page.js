export default `
<section data-hook="landing-page">
    {{^loggedIn}}
        {{^isMoz}}
          <div class="blue">
            <div class="stars"></div>
            <div class="full-page-wrapper space-between">
              <header id="main-header" class="responsive-content-wrapper">
                <h1>
                  <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
                </h1>
              </header>
              <div class="centered-banner responsive-content-wrapper">
                <div class="copter-wrapper fly-in">
                  <div class="copter"></div>
                </div>
                <h2>Something&#39;s up!</h2>
              </div>
              <footer id="main-footer" class="responsive-content-wrapper">
                <div data-hook="footer-view"></div>
              </footer>
            </div>
          </div>
        {{/isMoz}}
        {{#isMoz}}
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
              <div class="intro-text delayed-fade-in-up">
                <h2 class="banner">
                  <span data-l10n-id="landingIntroOne" class="block">Test out new features.</span>
                  <span data-l10n-id="landingIntroTwo" class="block">Give us feedback.</span>
                  <span data-l10n-id="landingIntroThree" class="block">Help build Firefox.</span>
                </h2>
              </div>
            </div>

            <div class="centered-banner responsive-content-wrapper delayed-fade-in-up">
              {{^isFirefox}}
                <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">(of course, you'll need Firefox to use Test Pilot)</span>
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
            {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information delayed-fade-in-up">By proceeding, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
            <div class="transparent-container">
              <div class="responsive-content-wrapper delayed-fade-in">
                  <h2 class="card-list-header" data-l10n-id="landingExperimentsTitle">Try these features today with Test Pilot</h2>
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
                  <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">(of course, you'll need Firefox to use Test Pilot)</span>
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
            {{#isFirefox}}<p data-l10n-id="landingLegalNotice" class="legal-information delayed-fade-in-up">By proceeding, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>{{/isFirefox}}
            </div>
            <footer id="main-footer" class="responsive-content-wrapper">
              <div data-hook="footer-view"></div>
            </footer>
          </div>
      {{/isMoz}}
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
              <h2 data-l10n-id="landingInstallMessage" class="emphasis">Test Pilot installed!</h2>
              <a href="/" data-l10n-id="landingInstalledButton" class="button large primary">Let's Go</a>
            </div>
            <div data-hook="default-message">
              <div class="copter-wrapper fly-down">
                <div class="copter"></div>
              </div>
              <h2 class="banner">
                <span data-l10n-id="landingInstallHeaderOne" class="block">Install the Test Pilot Add-on</span>
                <span data-l10n-id="landingInstallHeaderTwo" class="block">and you're good to go!</span>
              </h2>
              <button data-hook="install" class="button large primary">
                <span class="default-btn-msg" data-l10n-id="landingInstallButton">Install the Add-on</span>
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
