/* global ga */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { push as routerPush } from 'react-router-redux';

import cookies from 'js-cookie';
import Clipboard from 'clipboard';

import { getInstalled, isExperimentEnabled, isAfterCompletedDate, isInstalledLoaded } from '../reducers/addon';
import { getExperimentBySlug, isExperimentsLoaded } from '../reducers/experiments';
import experimentSelector from '../selectors/experiment';
import { uninstallAddon, installAddon, enableExperiment, disableExperiment, pollAddon } from '../lib/addon';
import addonActions from '../actions/addon';
import newsletterFormActions from '../actions/newsletter-form';
import RestartPage from '../containers/RestartPage';

const clipboard = new Clipboard('button');

class App extends Component {
  constructor(props) {
    super(props);
    this.lastPingPathname = null;
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
      let slug = pathname.substring(experimentsPath.length);
      // Trim trailing slash, if necessary
      if (slug.charAt(slug.length - 1) === '/') {
        slug = slug.substring(0, slug.length - 1);
      }
      const experiment = this.props.getExperimentBySlug(slug);
      this.debounceSendToGA(pathname, 'pageview', {
        dimension1: hasAddon,
        dimension4: isExperimentEnabled(experiment),
        dimension5: experiment.title,
        dimension6: experiment.installation_count
      });
    }
  }

  debounceSendToGA(pathname, type, dataIn) {
    if (this.lastPingPathname === pathname) { return; }
    this.lastPingPathname = pathname;
    if (window.ga && ga.loaded) {
      const data = dataIn || {};
      data.hitType = type;
      data.location = window.location;
      ga('send', data);
    }
  }

  componentDidUpdate() {
    this.measurePageview();
  }

  render() {
    const { restart } = this.props.addon;
    if (restart.isRequired) {
      return <RestartPage {...this.props}/>;
    }
    return React.cloneElement(this.props.children, this.props);
  }
}

function sendToGA(type, dataIn) {
  const data = dataIn || {};
  const hitCallback = () => {
    if (data.outboundURL) {
      document.location = data.outboundURL;
    }
  };
  if (window.ga && ga.loaded) {
    data.hitType = type;
    data.hitCallback = hitCallback;
    ga('send', data);
  } else {
    hitCallback();
  }
}

function subscribeToBasket(email, callback) {
  const url = 'https://basket.mozilla.org/news/subscribe/';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `newsletters=test-pilot&email=${encodeURIComponent(email)}`
  }).then(callback)
  .catch(err => {
    // for now, log the error in the console & do nothing in the UI
    console && console.error(err); // eslint-disable-line no-console
  });
}


const mapStateToProps = state => ({
  addon: state.addon,
  experiments: experimentSelector(state),
  experimentsLoaded: isExperimentsLoaded(state.experiments),
  getExperimentBySlug: slug =>
    getExperimentBySlug(state.experiments, slug),
  hasAddon: state.addon.hasAddon,
  installed: getInstalled(state.addon),
  installedAddons: state.addon.installedAddons,
  installedLoaded: isInstalledLoaded(state.addon),
  isDev: state.browser.isDev,
  isExperimentEnabled: experiment =>
    isExperimentEnabled(state.addon, experiment),
  isAfterCompletedDate,
  isFirefox: state.browser.isFirefox,
  isMinFirefox: state.browser.isMinFirefox,
  newsletterForm: state.newsletterForm,
  routing: state.routing
});


const mapDispatchToProps = dispatch => ({
  navigateTo: path => dispatch(routerPush(path)),
  enableExperiment: experiment => enableExperiment(dispatch, experiment),
  disableExperiment: experiment => disableExperiment(dispatch, experiment),
  requireRestart: () => dispatch(addonActions.requireRestart()),
  setHasAddon: installed => {
    dispatch(addonActions.setHasAddon(installed));
    if (!installed) { pollAddon(); }
  },
  newsletterForm: {
    setEmail: email =>
      dispatch(newsletterFormActions.newsletterFormSetEmail(email)),
    setPrivacy: privacy =>
      dispatch(newsletterFormActions.newsletterFormSetPrivacy(privacy)),
    subscribe: email =>
      dispatch(newsletterFormActions.newsletterFormSubscribe(dispatch, email))
  }
});


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const newsletterForm = Object.assign({},
    stateProps.newsletterForm, dispatchProps.newsletterForm);
  return Object.assign({
    installAddon,
    uninstallAddon,
    sendToGA,
    subscribeToBasket,
    clipboard,
    userAgent: navigator.userAgent,
    openWindow: (href, name) => window.open(href, name),
    getWindowLocation: () => window.location,
    addScrollListener: listener =>
      window.addEventListener('scroll', listener),
    removeScrollListener: listener =>
      window.removeEventListener('scroll', listener),
    getScrollY: () => window.pageYOffset || document.documentElement.scrollTop,
    setScrollY: pos => window.scrollTo(0, pos),
    getElementY: sel => {
      const el = document.querySelector(sel);
      return el ? el.offsetTop : 0;
    },
    getElementOffsetHeight: sel => {
      const el = document.querySelector(sel);
      return el ? el.offsetHeight : 0;
    },
    getCookie: name => cookies.get(name),
    removeCookie: name => cookies.remove(name),
    getExperimentLastSeen: experiment =>
      parseInt(window.localStorage.getItem(`experiment-last-seen-${experiment.id}`), 10),
    setExperimentLastSeen: (experiment, value) =>
      window.localStorage.setItem(`experiment-last-seen-${experiment.id}`, value || Date.now())
  }, ownProps, stateProps, dispatchProps, {
    newsletterForm
  });
};


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
