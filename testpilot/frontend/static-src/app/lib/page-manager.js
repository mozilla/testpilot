import app from 'ampersand-app';
import AmpersandViewSwitcher from 'ampersand-view-switcher';

import ErrorPage from '../views/error-page';
import ExperimentPage from '../views/experiment-page';
import ExperimentListPage from '../views/experiment-list-page';
import LandingPage from '../views/landing-page';
import LegacyPage from '../views/legacy-page';
import NotFoundPage from '../views/not-found-page';
import OnboardingPage from '../views/onboarding-page';
import RetirePage from '../views/retire-page';
import SharePage from '../views/share';

// PageManager is an ampersand-view-switcher wrapper
//
// * Acts as a Dispatcher: Router converts URL to event, this class subscribes
//   to the event, creates the page, and swaps it in
export default class PageManager {
  constructor(opts) {
    if (!opts.pageContainer) {
      throw new Error('PageManager constructor must be passed a pageContainer element');
    }

    this.pages = {
      'landing': LandingPage,
      'experiments': ExperimentListPage,
      'experimentDetail': ExperimentPage,
      'legacy': LegacyPage,
      'share': SharePage,
      'notFound': NotFoundPage,
      'onboarding': OnboardingPage,
      'error': ErrorPage,
      'retire': RetirePage
    };

    this._viewSwitcher = new AmpersandViewSwitcher(opts.pageContainer, {
      show: (view) => {
        document.title = view.pageTitle;
        document.body.scrollTop = 0;
        const title = document.querySelector('head title');
        const args = JSON.stringify(view.getL10nArgs());
        title.setAttribute('data-l10n-args', args);
        title.setAttribute('data-l10n-id', view.pageTitleL10nID);
      }
    });

    app.on('router:new-page', this.onNewPage.bind(this));
  }

  onNewPage(data) {
    const page = data && data.page;
    const opts = data && data.opts;
    if (page in this.pages) {
      // instantiate new page
      const Ctor = this.pages[page];
      const newPage = new Ctor(opts);

      // load new page
      this._viewSwitcher.set(newPage);
    } else {
      // if the router is broken, it's better to show the user an error page
      // than to do nothing or show a broken, blank page
      console.error('PageManager: Unknown page requested: ' + page); // eslint-disable-line no-console
      app.router.redirectTo('error');
    }
  }
}
