export default `
  <section class="navbar fixed-header">
    <div id="condensed-branding" class="{{#scrolled}}detail-header{{/scrolled}}">
      <div class="wrapper">
        <header>
         {{^scrolled}}<h1>Idea Town</h1>{{/scrolled}}
         {{#scrolled}}<h1>{{title}}</h1>{{/scrolled}}
        </header>
        {{^scrolled}}
          <div id="avatar-wrapper">
            <span class="default-avatar" data-hook="logout"></span>
          </div>
        {{/scrolled}}
        {{#scrolled}}
          <div class="idea-controls">
            {{#isInstalled}}
              <button data-hook="install" class="button primary">Enable {{title}}</button>
            {{/isInstalled}}
            {{^isInstalled}}
              <button data-hook="uninstall" class="button primary">Disable {{title}}</button>
            {{/isInstalled}}
            <div class="user-count">7,654,321</div>
          </div>
        {{/scrolled}}
      </div>
    </div>
  </section>
`;
