/* global ga */
import { MessageContext } from 'fluent/compat';
import negotiateLanguages from 'fluent-langneg/compat';
import { LocalizationProvider } from 'fluent-react/compat';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import cookies from 'js-cookie';
import Clipboard from 'clipboard';


import { getInstalled, isExperimentEnabled, isAfterCompletedDate, isInstalledLoaded } from '../reducers/addon';
import { setState as setBrowserState } from '../actions/browser';
import { getExperimentBySlug } from '../reducers/experiments';
import { getChosenTest } from '../reducers/varianttests';
import experimentSelector from '../selectors/experiment';
import { uninstallAddon, installAddon, enableExperiment, disableExperiment, pollAddon } from '../lib/InstallManager';
import { fetchUserCounts } from '../actions/experiments';
import { setLocalizations } from '../actions/localizations';
import { chooseTests } from '../actions/varianttests';
import addonActions from '../actions/addon';
import newsletterFormActions from '../actions/newsletter-form';
import RestartPage from '../containers/RestartPage';
import Loading from '../components/Loading';
import { isFirefox, isMinFirefoxVersion, isMobile } from '../lib/utils';
import newsUpdatesSelector from '../selectors/news';
import config from '../config';

let clipboard = null;
if (typeof document !== 'undefined') {
  clipboard = new Clipboard('button');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.lastPingPathname = null;
  }

  measurePageview() {
    const { hasAddon, installed, installedLoaded } = this.props;

    // If we have an addon, wait until the installed experiments are loaded
    if (hasAddon && !installedLoaded) { return; }

    const pathname = window.location.pathname;

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

  componentDidMount() {
    const userAgent = navigator.userAgent.toLowerCase();
    this.props.setHasAddon(!!window.navigator.testpilotAddon);
    this.props.setBrowserState({
      userAgent,
      isFirefox: isFirefox(userAgent),
      isMobile: isMobile(userAgent),
      isMinFirefox: isMinFirefoxVersion(userAgent, config.minFirefoxVersion),
      isDev: config.isDev,
      locale: (navigator.language || '').split('-')[0]
    });
    this.props.chooseTests();
    const userCountsPromise = this.props.fetchUserCounts(config.usageCountsURL);
    this.measurePageview();

    const langs = {};

    function addLang(lang, response) {
      if (response.ok) {
        return response.text().then(data => {
          langs[lang] = `${langs[lang] || ''}${data}
`;
        });
      }
    }

    const negotiated = negotiateLanguages(
      navigator.languages,
      config.AVAILABLE_LOCALES,
      { defaultLocale: 'en-US' }
    );

    const promises = negotiated.map(language =>
      Promise.all(
        [
          fetch(`/static/locales/${language}/app.ftl`).then(response => addLang(language, response)),
          fetch(`/static/locales/${language}/experiments.ftl`).then(response => addLang(language, response))
        ]
      )
    );

    promises.push(userCountsPromise);

    Promise.all(promises).then(() => {
      this.props.setLocalizations(langs);
      const staticNode = document.getElementById('static-root');
      if (staticNode) {
        staticNode.parentNode.removeChild(staticNode);
      }
    });
  }

  render() {
    const { restart } = this.props.addon;
    if (restart.isRequired) {
      return <RestartPage {...this.props}/>;
    }

    function* generateMessages(languages, localizations) {
      for (const lang of languages) {
        const cx = new MessageContext(lang);
        cx.addMessages(localizations[lang]);
        yield cx;
      }
    }

    if (Object.keys(this.props.localizations).length === 0) {
      return <Loading {...this.props} />;
    }
    return <LocalizationProvider messages={ generateMessages(
      navigator.languages,
      this.props.localizations
    ) }>
      { React.cloneElement(this.props.children, this.props) }
    </LocalizationProvider>;
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
    const chosenTest = getChosenTest();
    data.hitType = type;
    data.hitCallback = hitCallback;
    data.dimension8 = chosenTest.test;
    data.dimension9 = chosenTest.variant;
    ga('send', data);
  } else {
    hitCallback();
  }
}

const mapStateToProps = state => ({
  addon: state.addon,
  experiments: experimentSelector(state),
  localizations: state.localizations,
  newsUpdates: newsUpdatesSelector(state),
  slug: state.experiments.slug,
  getExperimentBySlug: slug =>
    getExperimentBySlug(state.experiments, slug),
  hasAddon: state.addon.hasAddon,
  clientUUID: state.addon.clientUUID,
  installed: getInstalled(state.addon),
  installedAddons: state.addon.installedAddons,
  installedLoaded: isInstalledLoaded(state.addon),
  isDev: state.browser.isDev,
  isExperimentEnabled: experiment =>
    isExperimentEnabled(state.addon, experiment),
  isAfterCompletedDate,
  isFirefox: state.browser.isFirefox,
  isMinFirefox: state.browser.isMinFirefox,
  isMobile: state.browser.isMobile,
  userAgent: state.browser.userAgent,
  locale: state.browser.locale,
  newsletterForm: state.newsletterForm,
  routing: state.routing,
  varianttests: state.varianttests
});


const mapDispatchToProps = dispatch => ({
  setBrowserState: state => dispatch(setBrowserState(state)),
  chooseTests: () => dispatch(chooseTests()),
  fetchUserCounts: (url) => dispatch(fetchUserCounts(url)),
  navigateTo: path => {
    window.location = path;
  },
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
    subscribe: (email) =>
      dispatch(newsletterFormActions.newsletterFormSubscribe(dispatch, email, '' + window.location))
  },
  setLocalizations: localizations =>
    dispatch(setLocalizations(localizations))
});


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const newsletterForm = Object.assign({},
    stateProps.newsletterForm, dispatchProps.newsletterForm);
  return Object.assign({
    installAddon,
    uninstallAddon,
    sendToGA,
    clipboard,
    setPageTitleL10N: (id, args) => {
      if (typeof document === 'undefined') { return; }

      const title = document.querySelector('head title');
      title.setAttribute('data-l10n-id', id);
      title.setAttribute('data-l10n-args', JSON.stringify(args));
    },
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
    getExperimentLastSeen: experiment => {
      if (typeof document !== 'undefined') {
        return parseInt(window.localStorage.getItem(`experiment-last-seen-${experiment.id}`), 10);
      }
      return 0;
    },
    setExperimentLastSeen: (experiment, value) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`experiment-last-seen-${experiment.id}`, value || Date.now());
      }
    }
  }, ownProps, stateProps, dispatchProps, {
    newsletterForm
  });
};


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
