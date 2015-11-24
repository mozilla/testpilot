export default `
  <div class="page">
    <section id="details" data-hook="experiment-page">
      <header data-hook="main-header"></header>
      <div class="details-header-wrapper">
        <div class="details-header">
          <h1 data-hook="title"></h1>
          <div class="idea-controls">
            <button data-hook="feedback" id="feedback-button" class="button primary">Give Feedback</button>
            <button data-hook="uninstall" id="uninstall-button" class="button neutral"><span class="state-change-inner"></span><span class="transition-text">Disabling...</span><span class="default-text">Disable <span data-hook="title"></span><span></button>
            <button data-hook="install" id="install-button" class="button primary"><span class="state-change-inner"></span><span class="transition-text">Enabling...</span><span class="default-text">Enable <span data-hook="title"></span></span></button>
          </div>
        </div>
      </div>

      <div data-hook="details">
        <div class="details-content">
          <div class="details-overview">
            <img data-hook="thumbnail" src="" width="260" height="260">
            <section data-hook="measurements-container" class="measurement">
              <h3>Measurements</h3>
              <p class="disclaimer">All data is collected anonymously and used only to help us improve this test.</p>
              <div data-hook="measurements-html"></div>
            </section>
            <section>
              <h3>Brought to you by</h3>
              <ul class="contributors"></ul>
            </section>
            <section>
              <h3>Details</h3>
              <table class="stats">
                <tr data-hook="version-container">
                  <td>Version</td>
                  <td>
                    <span data-hook="version"></span>
                    &nbsp;<a data-hook="changelog-url">changelog</a>
                  </td>
                </tr>
                <tr>
                  <td>Last Update</td>
                  <td data-hook="modified-date"></td>
                </tr>
                <tr>
                  <td>Contribute</td>
                  <td><a data-hook="contribute-url"></a></td>
                </tr>
              </table>
            </section>
          </div>

          <div class="details-description"></div>
        </div>
      </div>

    </section>
    <div data-hook="main-footer"></div>
  </div>
`;

