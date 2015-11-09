export default `
        <div class="details-content">
          <div class="details-overview">
            <img data-hook="thumbnail" src="" width="260">
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
                  <td><a data-hook="contribute-url"><a></td>
                </tr>
              </table>
            </section>
          </div>

          <div class="details-description">
            <p data-hook="description" class="copy">
            <div data-hook="details" class="details-image">
              <img data-hook="detail-image" width="680">
              <p class="caption"><strong data-hook="detail-headline"></strong> <span data-hook="detail-copy"></span></p>
            </div>
          </div>
        </div>
`;
