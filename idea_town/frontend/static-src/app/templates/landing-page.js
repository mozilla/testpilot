export default `
  <section class="page" data-hook="landing-page">
    {{^loggedIn}}
      <div class="firefox-logo"></div>
      <h1 class="hero">Introducing Idea Town</h1>
      <h2 class="sub-hero">We're building the next generation of<br> Firefox features and we want your feedback! <br>Get started with a Firefox Account.</h2>
      <div class="cta-layout-wrapper">
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
      <h1 class="hero">Thanks for Signing up!</h1>
      <h2 class="sub-hero">Install the Idea Town Add-on to participate<br> in experiments and give us feedback<br></h2>
      <div class="cta-layout-wrapper">
        <div class="cta-layout">
          <a href="{{ downloadUrl }}"><button class="button large primary">Install the Add-on</button></a>
        </div>
        <div class="town"></div>
      </div>
    {{/loggedIn}}
  </section>
`;
