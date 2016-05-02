export default `
    <div>
      <div class="blue full-page-wrapper">
        <div class="stars"></div>
        <header data-hook="header-view"></header>
        <div class="responsive-content-wrapper reverse-split-banner ">
          <div class="copter-wrapper">
            <div class="copter"></div>
          </div>
          <div class="intro-text">
            <h2 data-l10n-id="experimentListPageHeader" class="banner">Welcome to Firefox Test Pilot!</h2>
            <p data-l10n-id="experimentListPageSubHeader">We're always trying out new features in Firefox. <br> Pick any of the tests below to see what we're working on!</p>
          </div>
        </div>

        <div class="pinstripe responsive-content-wrapper"></div>
        <div class="responsive-content-wrapper">
          <div data-hook="experiment-list"></div>
        </div>
        <footer id="main-footer" class="responsive-content-wrapper">
          <div data-hook="footer-view"></div>
        </footer>
      </div>
    </div>
`;
