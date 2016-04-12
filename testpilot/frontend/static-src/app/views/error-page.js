import PageView from './page-view';

export default PageView.extend({
  template: `
    <div class="blue">
      <div class="stars"></div>
      <div id="full-page-wrapper" class="space-between">
        <header data-hook="header-view"></header>
        <div class="centered-banner">
          <div id="four-oh-four" class="modal delayed-fade-in">
            <h1 data-l10n-id="errorHeading" class="title">Whoops!</h1>
            <div class="modal-content">
              <p data-l10n-id="errorMessage">Looks like we broke something. <br> Maybe try again later.</p>
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


