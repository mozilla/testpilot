export default `
  <div class="page">
    <section id="details" data-hook="experiment-page">
      <header data-hook="main-header"></header>
      <div class="details-header-wrapper">
        <div class="details-header">
          <h1 data-hook="title"></h1>
          <span class="now-active" data-hook="now-active" data-l10n-id="nowActive">Now Active</span>
          <div class="idea-controls">
            <button data-l10n-id="giveFeedback" data-hook="feedback" id="feedback-button" class="button primary">Give Feedback</button>
            <button data-hook="uninstall" id="uninstall-button" class="button neutral"><span class="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" class="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" class="default-text">Disable <span data-hook="title"></span></span></button>
            <button data-hook="install" id="install-button" class="button primary"><span class="state-change-inner"></span><span data-l10n-id="enableExperimentTransition" class="transition-text">Enabling...</span><span data-l10n-id="enableExperiment" class="default-text">Enable <span data-hook="title"></span></span></button>
            <span class="user-count"></span>
            <span data-hook="install-count"></span>
          </div>
        </div>
      </div>

      <div data-hook="details">
        <div class="details-content">
          <div class="details-overview">
            <img data-hook="thumbnail" src="" width="260" height="260">
            <section data-hook="measurements-container" class="measurement">
              <h3 data-l10n-id="measurements">Measurements</h3>
              <p data-l10n-id="measurementsDisclaimer" class="disclaimer">All data is collected anonymously and used only to help us improve this test.</p>
              <div data-hook="measurements-html"></div>
              <a data-l10n-id="experimentPrivacyNotice" data-hook="privacy-notice-url"><span data-hook="title"></span> Privacy Notice</a>
            </section>
            <section>
              <h3 data-l10n-id="contributorsHeading">Brought to you by</h3>
              <ul class="contributors"></ul>
            </section>
            <section>
              <h3 data-l10n-id="detailsHeading">Details</h3>
              <table class="stats">
                <tr data-hook="version-container">
                  <td data-l10n-id="version">Version</td>
                  <td>
                    <span data-hook="version"></span>
                    &nbsp;<a data-l10n-id="changelog" data-hook="changelog-url">changelog</a>
                  </td>
                </tr>
                <tr>
                  <td data-l10n-id="lastUpdate">Last Update</td>
                  <td data-hook="modified-date"></td>
                </tr>
                <tr>
                  <td data-l10n-id="contribute">Contribute</td>
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
