import app from 'ampersand-app';
import PageView from './page-view';

export default PageView.extend({
  pageTitle: 'Firefox Test Pilot',
  pageTitleL10nID: 'pageTitleRetirePage',
  template: `
    <div class="blue">
      <div class="stars"></div>
      <div class="full-page-wrapper centered">
        <div class="centered-banner">
          <div disabled class="loading-pill">
            <h1 class="emphasis" data-l10n-id="retirePageProgressMessage">Shutting down...</h1>
            <div style="opacity: 1" class="state-change-inner"></div>
          </div>
          <div id="retire" class="modal no-display">
            <h1 data-l10n-id="retirePageHeadline" class="title">Thanks Again!</h1>
            <div class="modal-content">
              <p data-l10n-id="retirePageMessage">Hope you had fun experimenting with us. <br> Come back any time.</p>
            </div>
            <div class="modal-actions">
              <a data-l10n-id="retirePageSurveyButton" data-hook="take-survey" href="https://qsurvey.mozilla.com/s3/test-pilot" target="_blank" class="button default large">Take a quick survey</a>
              <a data-l10n-id="home" href="/" class="modal-escape">Home</a>
            </div>
          </div>
          <div class="copter-wrapper">
            <div class="copter no-display"></div>
          </div>
        </div>
      </div>
    </div>
  `,

  props: {
    'retireUrl': { type: 'string', default: '/users/retire/' }
  },

  events: {
    'click [data-hook=take-survey]': 'takeSurvey'
  },

  render() {
    PageView.prototype.render.apply(this, arguments);

    this.uninstallAddon();
    this.clearProgressMessage();

    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Retire'
    });
  },

  uninstallAddon() {
    app.webChannel.sendMessage('uninstall-self');
  },

  clearProgressMessage() {
    this.query('.loading-pill').classList.add('fade-out');
    setTimeout(() => {
      this.query('.loading-pill').classList.add('no-display');
      this.query('.copter').classList.remove('no-display');
      this.query('.copter').classList.add('fade-in');
      this.query('.modal').classList.remove('no-display');
      this.query('.modal').classList.add('fade-in');
    }, 500);
  },

  takeSurvey() {
    app.sendToGA('event', {
      eventCategory: 'RetirePage Interactions',
      eventAction: 'button click',
      eventLabel: 'take survey'
    });
  },

  // override page afterRender() to skip rendering header & footer
  afterRender() {}
});
