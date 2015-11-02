export default `
  <div class="page">
    <section class="page main-content" data-hook="landing-page">
      <header data-hook="main-header"></header>
      {{^loggedIn}}
        <div class="firefox-logo"></div>
        <h1>Introducing Idea Town</h1>
        <h2>We're building the next generation of<br> Firefox features and we want your feedback! <br>Get started with a Firefox Account.</h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <a href="/accounts/login/?next=/home"><button class="button large primary">Sign up</button></a>
            <a href="/accounts/login/?next=/home" class="fxa-alternate">Already have an account? Sign in.</a>
            <p class="cta-legal">By proceeding, you agree to the <a href="https://www.mozilla.org/about/legal/terms/services/">Terms of Service</a> and <a href="https://www.mozilla.org/privacy/firefox-cloud/">Privacy Notice</a> of Idea Town.</p>
          </div>
          <div class="town"></div>
        </div>
      {{/loggedIn}}
      {{#loggedIn}}
        <div class="firefox-logo"></div>
        <h1>Thanks for Signing up!</h1>
        <h2>Install the Idea Town Add-on to participate<br> in experiments and give us feedback<br></h2>
        <div id="cta-layout-wrapper">
          <div class="cta-layout">
            <a href="{{ downloadUrl }}"><button class="button large primary">Install the Add-on</button></a>
          </div>
          <div class="town"></div>
        </div>
      {{/loggedIn}}
    </section>
    <div data-hook="main-footer"></div>
  </div>
`;
