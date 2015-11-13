export default `
  <section class="navbar fixed-header">
    <div id="condensed-branding" data-hook="scroll-wrap">
      <div class="wrapper">
        <header><h1 data-hook="title"></h1></header>
        <div data-hook="no-scroll">
          <div data-hook="settings"></div>
        </div>

        <div data-hook="scroll" class="idea-controls">
          <button data-hook="install" class="button primary">Enable <span data-hook="title"></span></button>
          <button data-hook="uninstall" class="button primary">Disable <span data-hook="title"></span></button>
        </div>
      </div>
    </div>
  </section>
`;
