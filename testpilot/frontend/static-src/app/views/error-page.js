import PageView from './page-view';

export default PageView.extend({
  template: `
    <div id="full-page-wrapper" class="space-between blue">
      <header data-hook="header-view"></header>
      <div class="centered-banner">
        <div id="four-oh-four" class="delayed-fade-in">
          <h1 data-l10n-id="errorHeading">Whoops!</h1>
          <p data-l10n-id="errorMessage">Looks like we broke something. Maybe try again later :-\ </p>
        </div>
        <div class="copter spin"></div>
      </div>
      <footer id="main-footer" class="content-wrapper">
        <div data-hook="footer-view"></div>
      </footer>
    </div>
  `
});


