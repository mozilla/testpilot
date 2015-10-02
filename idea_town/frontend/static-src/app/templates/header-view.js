export default `
  <section class="navbar">
    {{#activeUser}}
      <div id="expanded-branding">
        <div class="wrapper">
          <header>
            <h1>Idea Town</h1>
            <p class="subtitle"> A place where ideas come to ideas
            and also ideas are ideas etc.</p>
          </header>
          <div class="town-background"></div>
          <div id="avatar-wrapper">
            <span class="default-avatar" data-hook="logout"></span>
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
