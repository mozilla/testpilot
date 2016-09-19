import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';

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
      <Route path="/experiments/" component={ExperimentsListPage} />
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
    const { dispatch, routing, hasAddon, isFirefox } = this.props;
    const location = routing.locationBeforeTransitions;
    if (location.pathname === '/' && (hasAddon && isFirefox)) {
      dispatch(routerPush('/experiments/'));
    }
    if (location.pathname === 'experiments/' && (!hasAddon || !isFirefox)) {
      dispatch(routerPush('/'));
    }
  }

  constructor(props) {
    super(props);
    // Static router created at construction, because it does not accept prop updates.
    this.router = <AppRouter history={props.history} />;
  }
  render() { return this.router; }
  componentDidUpdate() { this.performRedirects(); }
}

export default connect(
  state => ({
    routing: state.routing,
    isFirefox: state.browser.isFirefox,
    hasAddon: state.addon.hasAddon
  })
)((props) => <BaseAppRedirector {...props} />);
