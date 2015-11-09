export default `
  <section class="navbar fixed-header">
    <div id="condensed-branding" data-hook="scroll-wrap">
      <div class="wrapper">
        <header><h1 data-hook="title"></h1></header>
        <div data-hook="no-scroll" id="avatar-wrapper">
          <img class="avatar" width="41" height="41" data-hook="logout">
          <span class="default-avatar" data-hook="logout"></span>
        </div>

        <div data-hook="scroll" class="idea-controls">
          <button data-hook="install" class="button primary">Enable <span data-hook="title"></span></button>
          <button data-hook="uninstall" class="button primary">Disable <span data-hook="title"></span></button>
        </div>
      </div>
    </div>
  </section>
`;
