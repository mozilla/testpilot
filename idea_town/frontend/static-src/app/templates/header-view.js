export default `
  <section class="navbar">
    {{#activeUser}}
      <div id="expanded-branding">
        <div class="wrapper">
          <header>
            <div class="firefox-logo"></div>
            <h1>Idea Town</h1>
            <p class="subtitle">The innovative community where new Ideas for Firefox are tested.</p>
          </header>
          <div class="town-background"></div>
          <div id="avatar-wrapper">
            {{#avatar}}
              <img class="avatar" src="{{avatar}}" width="41" height="41" data-hook="logout">
            {{/avatar}}
            {{^avatar}}
              <span class="default-avatar" data-hook="logout"></span>
            {{/avatar}}
          </div>
        </div>
      </div>
    {{/activeUser}}
    {{^activeUser}}
      <div id="tabzilla">
        <a href="https://www.mozilla.org/">Mozilla</a>
      </div>
    {{/activeUser}}
  </section>
`;
