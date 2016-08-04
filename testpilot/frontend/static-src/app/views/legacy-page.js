import PageView from './page-view';

//  Regarding localization: These strings were originally in the app.ftl, but
//  they make up a decent amount of words in there for localizers to work on,
//  and this is a view-once, temporary page for an (I think?) English-only
//  program.  So I took them back out and hardcoded them here.
export default PageView.extend({
  template: `
<div class="blue">
  <div class="stars"></div>
  <div class="full-page-wrapper space-between">
    <header id="main-header" class="responsive-content-wrapper">
      <h1>
        <a href="/" class="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
      </h1>
    </header>
    <div class="centered-banner">
      <div id="legacy-modal" class="modal delayed-fade-in">
        <div class="modal-content">
          <p>Hello there! Once upon a time, you installed an add-on called Test Pilot for Firefox.</p>
          <p>Well the Test Pilot program for trying experimental features in Firefox is back, and we thought you might like to check it out.</p>
          <p>The old add-on has been uninstalled for you. If you'd like the new one, just click the link.</p>
          <p>If you're not interested, simply close this tab and get back to browsing.</p>
        </div>
        <div class="modal-actions">
          <a class="button default large" href="/?utm_source=testpilot_legacy&utm_medium=firefox-browser">Check out Test Pilot</a>
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
  `,
  skipHeader: true
});
