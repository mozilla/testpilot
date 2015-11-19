export default `
  <div class="page">
    <section id="details" data-hook="experiment-page">
      <header data-hook="main-header"></header>
      <div id="details">
        <div class="details-sticker"></div>

        <div class="details-header-wrapper">
          <div class="details-header">
            <h1 data-hook="title"></h1>
            <div class="idea-controls">
              <button data-hook="feedback" class="button primary">Give Feedback</button>
              <button data-hook="uninstall" class="button">Disable <span data-hook="title"></span></button>
              <button data-hook="install" class="button primary">Enable <span data-hook="title"></span></button>
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

      </div>
    </section>
    <div data-hook="main-footer"></div>
  </div>
`;

