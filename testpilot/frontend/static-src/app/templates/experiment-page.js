export default `
  <section id="details" data-hook="experiment-page">
    <header data-hook="header-view"></header>
    <section data-hook="testpilot-promo"></section>
    <div class="default-background">
      <div class="details-header-wrapper" data-hook="has-status">
        <div class="status-bar" data-hook="status-type">
          <span data-hook="enabled-msg" data-l10n-id="isEnabledStatusMessage"><span data-hook="title"></span> is enabled.</span>
          <span data-hook="error-msg" data-l10n-id="installErrorMessage">Uh oh. <span data-hook="title"></span> could not be enabled. Try again later.</span>
        </div>
        <div class="details-header content-wrapper">
          <header>
            <h1 data-hook="title"></h1>
            <h4 data-hook="subtitle" class="subtitle"></h4>
          </header>
            <div class="experiment-controls" data-hook="active-user">

            <a data-hook="highlight-privacy" class="highlight-privacy" data-l10n-id=highlightPrivacy>Your privacy</a>
            <a data-l10n-id="giveFeedback" data-hook="feedback" id="feedback-button" class="button default" target="_blank">Give Feedback</a>
            <button data-hook="uninstall-experiment" id="uninstall-button" class="button secondary"><span class="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" class="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" class="default-text">Disable <span data-hook="title"></span></span></button>
            <button data-hook="install-experiment" id="install-button" class="button default"><span class="state-change-inner"></span><span data-l10n-id="enableExperimentTransition" class="transition-text">Enabling...</span><span data-l10n-id="enableExperiment" class="default-text">Enable <span data-hook="title"></span></span></button>
          </div>
        </div>
      </div>
      <div class="sticky-header-sibling"></div>

      <div data-hook="details">
          <div class="details-content content-wrapper">
            <div class="details-overview">
              <div class="experiment-icon-wrapper" data-hook="bg">
                <img class="experiment-icon" data-hook="thumbnail"></img>
              </div>
              <div class="details-sections">
                <section class="user-count">
                  <span data-l10n-id="userCountContainer">There are <span data-l10n-id="userCount" class="bold" data-hook="install-count"></span>
                  people trying <span data-hook="title"></span> right now!</span>
                </section>
                <div data-hook="inactive-user">
                  <section data-hook="introduction-container">
                    <div data-hook="introduction-html"></div>
                  </section>
                </div>
                <section data-hook="active-user">
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

                    <tr>
                      <td data-l10n-id="bugReports">Bug Reports</td>
                      <td><a data-hook="bug-report-url"></a></td>
                    </tr>

                    <tr>
                      <td data-l10n-id="discourse">Discourse</td>
                      <td><a data-hook="discourse-url"></a></td>
                    </tr>
                  </table>
                </section>
                <section class="contributors-section">
                  <h3 data-l10n-id="contributorsHeading">Brought to you by</h3>
                  <ul class="contributors"></ul>
                </section>
                <div data-hook="active-user">
                  <section data-hook="measurements-container" class="measurements">
                    <h3 data-l10n-id="measurements">Your privacy</h3>
                    <div data-hook="measurements-html" class="measurement"></div>
                    <a class="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-hook="privacy-notice-url">You can learn more about the data collection for <span data-hook="title"></span> here.</a>
                  </section>
                </div>
              </div>
            </div>

            <div class="details-description">
              <div data-hook="active-user">
                <section data-hook="introduction-container" class="introduction">
                  <div data-hook="introduction-html"></div>
                </section>
              </div>
              <div class="details-list"></div>
            </div>
          </div>
        </div>
      </div>
      <div data-hook="inactive-user">
        <h2 class="card-list-header" data-l10n-id="otherExperiments">Try out these experiments as well</h2>
        <div class="responsive-content-wrapper delayed-fade-in" data-hook="experiment-list"></div>
      </div>
      <footer id="main-footer" class="content-wrapper">
        <div data-hook="footer-view"></div>
      </footer>
  </section>
`;
