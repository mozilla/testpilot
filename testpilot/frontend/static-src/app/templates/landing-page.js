export default `
<section data-hook="landing-page">
    {{^loggedIn}}
        {{^isMoz}}
          <div class="blue">
            <div class="stars"></div>
            <div id="full-page-wrapper" class="space-between">
              <header id="main-header" class="responsive-content-wrapper">
                <h1>
                  <span class="firefox-logo"></span>
                  <span data-l10n-id="siteName">Firefox Test Pilot</span>
                </h1>
                <span/>
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
                <span class="firefox-logo"></span>
                <a href="/accounts/login/?next=/">
                  <span data-l10n-id="siteName">Firefox Test Pilot</span>
                </a>
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
              <button data-l10n-id="landingFxaGetStartedButton" class="button large primary" data-hook="get-started-with-account">Get started with a Firefox Account</button>
              {{/isFirefox}}
            </div>
            <p data-l10n-id="landingLegalNotice" class="legal-information delayed-fade-in-up">By proceeding, you agree to the <a href="https://www.mozilla.org/about/legal/terms/services/">Terms of Service</a> and <a href="https://www.mozilla.org/privacy/firefox-cloud/">Privacy Notice</a> of Test Pilot</p>
          </div>
          <div class="responsive-content-wrapper">
              <h2 class="experiment-list-header">Try these features today with Test Pilot</h2>
              <div data-hook='experiment-list'></div>
          </div>
          <div class="blue">
            <footer id="main-footer" class="responsive-content-wrapper">
              <div class="centered-banner">
                <div class="copter-wrapper">
                  <div class="copter"></div>
                </div>
                <h2 data-l10n-id="landingPageFooterCopy">More tests coming soon!</h2>
                {{^isFirefox}}
                  <span data-l10n-id="landingDownloadFirefoxDesc" class="parens">Firefox Test Pilot is for Firefox! Get it!</span>
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
                <button data-l10n-id="landingFxaGetStartedButton" class="button large primary" data-hook="get-started-with-account">Get started with a Firefox Account</button>
                {{/isFirefox}}
              </div>
              <div data-hook="footer-view"></div>
            </footer>
          </div>
      {{/isMoz}}
    {{/loggedIn}}
    {{#loggedIn}}
      <div id="full-page-wrapper" class="space-between">
        <header id="main-header" class="responsive-content-wrapper">
          <h1>
            <span class="firefox-logo"></span>
            <span data-l10n-id="siteName">Firefox Test Pilot</span>
          </h1>
        </header>
        <div class="centered-banner responsive-content-wrapper">
          <div data-hook="installed-message" class="no-display">
            <h2 data-l10n-id="landingInstallMessage" class="emphasis">Test Pilot installed!</h2>
            <a href="/" data-l10n-id="landingInstalledButton" class="button large default quick-pop no-display">Let's Go</a>
          </div>
          <div data-hook="default-message">
            <div class="copter-wrapper fly-down">
              <div class="copter"></div>
            </div>
            <h2 class="banner">
              <span data-l10n-id="landingInstallHeaderOne" class="block">Install the Test Pilot Add-on</span>
              <span data-l10n-id="landingInstallHeaderTwo" class="block">and you're good to go!</span>
            </h2>
            <button data-hook="install" class="button large default">
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
    {{/loggedIn}}
</section>
`;


