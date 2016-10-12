import React from 'react';
import { IndexRoute, Redirect, Route, Router } from 'react-router';

import App from '../containers/App';
import ErrorPage from '../containers/ErrorPage';
import ExperimentPage from '../containers/ExperimentPage';
import HomePage from '../containers/HomePage';
import LegacyPage from '../containers/LegacyPage';
import NotFoundPage from '../containers/NotFoundPage';
import OnboardingPage from '../containers/OnboardingPage';
import RestartPage from '../containers/RestartPage';
import RetirePage from '../containers/RetirePage';
import SharePage from '../containers/SharePage';


export default class Routes extends React.Component {
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/" component={App}>
          <IndexRoute component={HomePage} />
          <Redirect from="/experiments(/)" to="/" />
          <Route path="/experiments/:slug" component={ExperimentPage} />
          <Route path="/legacy" component={LegacyPage} />
          <Route path="/404" component={NotFoundPage} />
          <Route path="/share" component={SharePage} />
          <Route path="/restart" component={RestartPage} />
          <Route path="/error" component={ErrorPage} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/retire" component={RetirePage} />
          <Route path="*" component={NotFoundPage} />
        </Route>
      </Router>
    );
  }
}
