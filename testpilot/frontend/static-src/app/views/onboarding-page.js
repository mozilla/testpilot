import PageView from './page-view';

export default PageView.extend({
  template: `
    <div class="blue">
      <div class="stars"></div>
      <div class="full-page-wrapper space-between">
        <header data-hook="header-view"></header>
        <div class="centered-banner">
          <div id="onboarding" class="modal">
            <div class="modal-content centered">
              <div class="toolbar-button-onboarding"></div>
              <p data-l10n-id="onboardingMessage">We put an icon in your toolbar so you can always find Test Pilot.</p>
            </div>
          </div>
          <div class="copter-wrapper">
            <div class="copter fade-in-fly-up"></div>
          </div>
        </div>
        <footer id="main-footer" class="content-wrapper">
          <div data-hook="footer-view"></div>
        </footer>
      </div>
    </div>
  `
});


