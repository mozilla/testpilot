import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';

import { sendToGA } from '../lib/utils';
import { getInstalled, isExperimentEnabled, isInstalledLoaded } from '../reducers/addon';
import { getExperimentBySlug, isExperimentsLoaded } from '../reducers/experiments';

import LandingPage from '../containers/LandingPage';
import ExperimentsListPage from '../containers/ExperimentsListPage';
import ExperimentPage from '../containers/ExperimentPage';
import RetirePage from '../containers/RetirePage';
import Restart from '../containers/Restart';

import App from '../components/App';
import LegacyPage from '../components/LegacyPage';
import NotFoundPage from '../components/NotFoundPage';
import SharePage from '../components/SharePage';
import ErrorPage from '../components/ErrorPage';
import OnboardingPage from '../components/OnboardingPage';

const AppRouter = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage} />
      <Route path="/experiments(/)" component={ExperimentsListPage} />
      <Route path="/experiments/:slug" component={ExperimentPage} />
      <Route path="/legacy" component={LegacyPage} />
      <Route path="/404" component={NotFoundPage} />
      <Route path="/share" component={SharePage} />
      <Route path="/restart" component={Restart} />
      <Route path="/error" component={ErrorPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/retire" component={RetirePage} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);

// Wrapper for <Router> that handles state-based redirection logic
class BaseAppRedirector extends React.Component {

  performRedirects() {
    const { routing, hasAddon, isFirefox, navigateTo } = this.props;
    const location = routing.locationBeforeTransitions;
    if (location.pathname === '/' && (hasAddon && isFirefox)) {
      navigateTo('/experiments/');
    }
    if (location.pathname === 'experiments/' && (!hasAddon || !isFirefox)) {
      navigateTo('/');
    }
  }

  measurePageview() {
    const { routing, hasAddon, installed, installedLoaded, experimentsLoaded } = this.props;

    // Wait until experiments are loaded
    if (!experimentsLoaded) { return; }

    // If we have an addon, wait until the installed experiments are loaded
    if (hasAddon && !installedLoaded) { return; }

    const { pathname } = routing.locationBeforeTransitions;

    const experimentsPath = 'experiments/';

    if (pathname === '/') {
      const installedCount = Object.keys(installed).length;
      const anyInstalled = installedCount > 0;
      this.debounceSendToGA(pathname, 'pageview', {
        dimension1: hasAddon,
        dimension2: anyInstalled,
        dimension3: installedCount
      });
    } else if (pathname === experimentsPath) {
      this.debounceSendToGA(pathname, 'pageview', {
        dimension1: hasAddon
      });
    } else if (pathname.indexOf(experimentsPath) === 0) {
      const slug = pathname.substring(experimentsPath.length);
      const experiment = this.props.getExperimentBySlug(slug);
      this.debounceSendToGA(pathname, 'pageview', {
        dimension1: hasAddon,
        dimension4: isExperimentEnabled(experiment),
        dimension5: experiment.title,
        dimension6: experiment.installation_count
      });
    }
  }

  debounceSendToGA(pathname, type, data) {
    if (this.lastPingPathname === pathname) { return; }
    this.lastPingPathname = pathname;
    sendToGA(type, data);
  }

  constructor(props) {
    super(props);
    // Static router created at construction, because it does not accept prop updates.
    this.router = <AppRouter history={props.history} />;
    this.lastPingPathname = null;
  }

  render() { return this.router; }

  componentDidUpdate() {
    this.performRedirects();
    this.measurePageview();
  }
}

export default connect(
  state => ({
    routing: state.routing,
    experimentsLoaded: isExperimentsLoaded(state.experiments),
    isFirefox: state.browser.isFirefox,
    hasAddon: state.addon.hasAddon,
    installed: getInstalled(state.addon),
    installedLoaded: isInstalledLoaded(state.addon),
    getExperimentBySlug: slug =>
      getExperimentBySlug(state.experiments, slug),
    isExperimentEnabled: experiment =>
      isExperimentEnabled(state.addon, experiment)
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path))
  })
)((props) => <BaseAppRedirector {...props} />);
