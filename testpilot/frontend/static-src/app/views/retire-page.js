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
            <h1 class="emphasis" data-l10n-id="retirePageProgressMessage">Shutting down Test Pilot...</h1>
            <div style="opacity: 1" class="state-change-inner"></div>
          </div>
          <div id="retire" class="modal no-display">
            <h1 data-l10n-id="retirePageHeadline" class="title">Thanks Again!</h1>
            <div class="modal-content">
              <p data-l10n-id="retirePageMessage">Before you go, we want to thank you for contributing to Test Pilot. <br> You're welcome back any time!</p>
            </div>
            <div class="modal-actions"><a data-l10n-id="retirePageSurveyButton" href="external-survey.html" class="button default large">Take a quick survey</a><a data-l10n-id="home" href="/" class="modal-escape">Home</a></div>
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

  render() {
    PageView.prototype.render.apply(this, arguments);

    this.uninstallAddon();

    this.retireUserAccount()
      .then(() => app.me.fetch())
      .then(() => this.clearProgressMessage())
      .catch(err => console.log(err)); // eslint-disable-line no-console
  },

  uninstallAddon() {
    app.webChannel.sendMessage('uninstall-self');
  },

  retireUserAccount() {
    return fetch(this.retireUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-CSRFTOKEN': app.me.csrfToken
      },
      body: ''
    }).then(() => {
      app.sendToGA('event', {
        eventCategory: 'HomePage Interactions',
        eventAction: 'button click',
        eventLabel: 'Retire'
      });
    });
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

  // override page afterRender() to skip rendering header & footer
  afterRender() {}
});

