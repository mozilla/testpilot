export default `
    <div>
      <div class="blue">
        <header data-hook="header-view"></header>
        <div class="centered-banner">
          <div class="copter-wrapper">
            <div class="copter fly-up"></div>
          </div>
          <div class="intro-text">
            <h2 data-l10n-id="experimentListPageHeader">Welcome to Firefox Test Pilot!</h2>
            <p data-l10n-id="experimentListPageSubHeader">We're always trying out new features in Firefox. <br> Pick any of the tests below to see what we're working on!</p>
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <div data-hook="experiment-list"></div>
      </div>
      <footer id="main-footer" class="content-wrapper">
        <div data-hook="footer-view"></div>
      </footer>
    </div>
`;
