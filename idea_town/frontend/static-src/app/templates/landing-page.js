export default `
  <div class="page">
    <section class="main-content" data-hook="landing-page">
      <header data-hook="main-header"></header>
      {{^loggedIn}}
        <div class="firefox-logo"></div>
        <h1 data-l10n-id="landingWelcome">Welcome to Idea Town</h1>
        <h2 data-l10n-id="landingIntro">Test new features.<br>
            Give us feedback.<br>
            Help build Firefox.</h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <button data-l10n-id="landingFxaGetStartedButton" data-hook='show-beta-notice' class="button large dark">Get started with your Firefox Account</button>
            <a data-l10n-id="landingFxaAlternateButton" data-hook='show-beta-notice' href="/accounts/login/?next=/home" class="fxa-alternate">Don't have an account? Sign up.</a>
            <p data-l10n-id="landingCtaLegal" class="cta-legal">By proceeding, you agree to the <a href="https://www.mozilla.org/about/legal/terms/services/">Terms of Service</a> and <a href="https://www.mozilla.org/privacy/firefox-cloud/">Privacy Notice</a> of Idea Town.</p>
          </div>
          <div class="town">
            <div id="beta-notice-modal" class="hidden">
              <span data-l10n-id="landingBetaNotice">We're still building Idea Town! Sign up now and we'll let you know when it's ready to go!</span>
              <div class="modal-controls">
                <a data-l10n-id="landingBetaSignup" href="/accounts/login/?next=/home" class="button primary">Sign me up!</a>
              </div>
            </div>
            <div id="copter" class="copter hover"></div>
          </div>
        </div>
      {{/loggedIn}}
      {{#loggedIn}}
        <div class="firefox-logo"></div>
        <h2 data-l10n-id="landingInstallHeader">Install the Idea Town Add-on <br> and you're good to go!</h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <a href="{{ downloadUrl }}" class="button link large primary"><span data-l10n-id="landingInstallButton">Install the Add-on</span></a>
          </div>
          <div class="town">
            <div class="copter"></div>
          </div>
        </div>
      {{/loggedIn}}
    </section>
    <div data-hook="main-footer" class="vertical-flex-container"></div>
    <div id="modal-screen" class="no-display"></div>
  </div>
`;
