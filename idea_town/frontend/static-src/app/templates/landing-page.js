export default `
  <div class="page">
    <section class="main-content" data-hook="landing-page">
      <header data-hook="main-header"></header>
      {{^loggedIn}}
        <div class="firefox-logo"></div>
        <h1>Welcome to Idea Town</h1>
        <h2>Test new features.<br>
            Give us feedback.<br>
            Help build Firefox.</h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <button data-hook='show-beta-notice' class="button large dark">Get started with your Firefox Account</button>
            <a data-hook='show-beta-notice' href="/accounts/login/?next=/home" class="fxa-alternate">Don't have an account? Sign up.</a>
            <p class="cta-legal">By proceeding, you agree to the <a href="https://www.mozilla.org/about/legal/terms/services/">Terms of Service</a> and <a href="https://www.mozilla.org/privacy/firefox-cloud/">Privacy Notice</a> of Idea Town.</p>
          </div>
          <div class="town">
            <div id="beta-notice-modal" class="hidden">
              We're still building Idea Town! Sign up now and we'll let you know when it's ready to go!
              <div class="modal-controls">
                <a href="/accounts/login/?next=/home"><button class="button primary">Sign me up!</button></a>
              </div>
            </div>
            <div id="copter" class="copter hover"></div>
          </div>
        </div>
      {{/loggedIn}}
      {{#loggedIn}}
        <div class="firefox-logo"></div>
        <h2>Install the Idea Town Add-on <br> and you're good to go!</h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <a href="{{ downloadUrl }}"><button class="button large primary">Install the Add-on</button></a>
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
