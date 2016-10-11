import React from 'react';
import { IndexRoute, Redirect, Route, Router } from 'react-router';

import App from '../containers/App';

import ErrorPage from '../components/ErrorPage';
import ExperimentPage from '../components/ExperimentPage';
import HomePage from '../components/HomePage';
import LegacyPage from '../components/LegacyPage';
import NotFoundPage from '../components/NotFoundPage';
import OnboardingPage from '../components/OnboardingPage';
import Restart from '../components/Restart';
import RetirePage from '../components/RetirePage';
import SharePage from '../components/SharePage';


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
          <Route path="/restart" component={Restart} />
          <Route path="/error" component={ErrorPage} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/retire" component={RetirePage} />
          <Route path="*" component={NotFoundPage} />
        </Route>
      </Router>
    );
  }
}
