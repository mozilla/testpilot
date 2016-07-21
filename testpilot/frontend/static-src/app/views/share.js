import PageView from './page-view';

export default PageView.extend({
  template: `
    <div class="blue">
      <div class="stars"></div>
      <div class="full-page-wrapper space-between">
        <header data-hook="header-view"></header>
        <div class="centered-banner">
          <div id="share" class="modal delayed-fade-in">
            <div class="modal-content">
              <p data-l10n-id="sharePrimary">Love Test Pilot? Help us find some new recruits.</p>
              <ul class="share-list">
                <li class="share-facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A//testpilot.firefox.com" target="_blank">Facebook</a></li>
                <li class="share-twitter"><a href="https://twitter.com/home?status=https%3A//testpilot.firefox.com" target="_blank">Twitter</a></li>
                <li class="share-email"><a href="mailto:?body=https%3A//testpilot.firefox.com" data-l10n-id="shareEmail">E-mail</a></li>
              </ul>
              <p data-l10n-id="shareSecondary">or just copy and paste this link...</p>
              <fieldset class="share-url">
                <input type="text" readonly value="https://testpilot.firefox.com">
                <button data-l10n-id="shareCopy" data-clipboard-target=".share-url input">Copy</button>
              </fieldset>
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
