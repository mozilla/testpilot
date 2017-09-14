/* global ga */
import { MessageContext } from 'fluent/compat';
import { negotiateLanguages } from 'fluent-langneg/compat';
import { LocalizationProvider } from 'fluent-react/compat';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import cookies from 'js-cookie';
import Clipboard from 'clipboard';

import likelySubtagsData from 'cldr-core/supplemental/likelySubtags.json';

import { getInstalled, isExperimentEnabled, isAfterCompletedDate, isInstalledLoaded } from '../../reducers/addon';
import { setState as setBrowserState } from '../../actions/browser';
import { getExperimentBySlug } from '../../reducers/experiments';
import { getChosenTest } from '../../reducers/varianttests';
import experimentSelector from '../../selectors/experiment';
import { uninstallAddon, installAddon, enableExperiment, disableExperiment, pollAddon } from '../../lib/InstallManager';
import { setLocalizations, setNegotiatedLanguages } from '../../actions/localizations';
import { localizationsSelector, negotiatedLanguagesSelector } from '../../selectors/localizations';
import { chooseTests } from '../../actions/varianttests';
import addonActions from '../../actions/addon';
import newsletterFormActions from '../../actions/newsletter-form';
import RestartPage from '../../containers/RestartPage';
import UpgradeWarningPage from '../../containers/UpgradeWarningPage';
import { isFirefox, isMinFirefoxVersion, isMobile } from '../../lib/utils';
import { staleNewsUpdatesSelector, freshNewsUpdatesSelector } from '../../selectors/news';
import config from '../../config';

let clipboard = null;
if (typeof document !== 'undefined') {
  clipboard = new Clipboard('button');
}

export function shouldShowUpgradeWarning(hasAddon, hasAddonManager, thisIsFirefox, host) {
  if (hasAddon === null) return false;
  if (hasAddonManager) return false;
  if (!thisIsFirefox) return false;
  if (!hasAddonManager && config.nonAddonManagerDevHosts.includes(host)) return false;
  return true;
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
        dimension5: experiment.title
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
      host: window.location.host,
      protocol: window.location.protocol,
      hasAddonManager: (typeof navigator.mozAddonManager !== 'undefined'),
      isFirefox: isFirefox(userAgent),
      isMobile: isMobile(userAgent),
      isMinFirefox: isMinFirefoxVersion(userAgent, config.minFirefoxVersion),
      isProdHost: window.location.host === config.prodHost,
      isDevHost: config.devHosts.includes(window.location.host),
      isDev: config.isDev,
      locale: (navigator.language || '').split('-')[0]
    });
    this.props.chooseTests();
    this.measurePageview();

    const langs = {};

    function addLang(lang, response) {
      if (response.ok) {
        return response.text().then(data => {
          langs[lang] = `${langs[lang] || ''}${data}
`;
        });
      }
      return Promise.resolve();
    }

    const availableLanguages = document.querySelector(
      'meta[name=availableLanguages]').content.split(',');

    const negotiated = negotiateLanguages(
      navigator.languages,
      availableLanguages,
      {
        defaultLocale: 'en-US',
        likelySubtags: likelySubtagsData.supplemental.likelySubtags
      }
    );

    this.props.setNegotiatedLanguages(negotiated);

    const promises = negotiated.map(language =>
      Promise.all(
        [
          fetch(`/static/locales/${language}/app.ftl`).then(response => addLang(language, response)),
          fetch(`/static/locales/${language}/experiments.ftl`).then(response => addLang(language, response))
        ]
      )
    );

    Promise.all(promises).then(() => {
      this.props.setLocalizations(langs);
      const staticNode = document.getElementById('static-root');
      if (staticNode) {
        staticNode.parentNode.removeChild(staticNode);
      }
    });
  }

  shouldShowUpgradeWarning() {
    const { hasAddon, hasAddonManager, host } = this.props;
    return shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox, host);
  }

  render() {
    const { restart } = this.props.addon;
    if (restart.isRequired) {
      return <RestartPage {...this.props} />;
    }

    if (this.shouldShowUpgradeWarning()) {
      return <UpgradeWarningPage {...this.props} />;
    }

    function* generateMessages(languages, localizations) {
      for (const lang of languages) {
        if (typeof localizations[lang] === 'string') {
          const cx = new MessageContext(lang);
          cx.addMessages(localizations[lang]);
          yield cx;
        }
      }
    }

    return <LocalizationProvider messages={ generateMessages(
      this.props.negotiatedLanguages,
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
  clientUUID: state.addon.clientUUID,
  experiments: experimentSelector(state),
  freshNewsUpdates: freshNewsUpdatesSelector(state),
  getExperimentBySlug: slug =>
    getExperimentBySlug(state.experiments, slug),
  hasAddon: state.addon.hasAddon,
  hasAddonManager: state.browser.hasAddonManager,
  host: state.browser.host,
  installed: getInstalled(state.addon),
  installedAddons: state.addon.installedAddons,
  installedLoaded: isInstalledLoaded(state.addon),
  isDev: state.browser.isDev,
  isExperimentEnabled: experiment =>
    isExperimentEnabled(state.addon, experiment),
  isAfterCompletedDate,
  isFirefox: state.browser.isFirefox,
  isMinFirefox: state.browser.isMinFirefox,
  isDevHost: state.browser.isDevHost,
  isProdHost: state.browser.isProdHost,
  isMobile: state.browser.isMobile,
  userAgent: state.browser.userAgent,
  locale: state.browser.locale,
  localizations: localizationsSelector(state),
  negotiatedLanguages: negotiatedLanguagesSelector(state),
  newsletterForm: state.newsletterForm,
  protocol: state.browser.protocol,
  routing: state.routing,
  slug: state.experiments.slug,
  staleNewsUpdates: staleNewsUpdatesSelector(state),
  varianttests: state.varianttests
});


const mapDispatchToProps = dispatch => ({
  setBrowserState: state => dispatch(setBrowserState(state)),
  chooseTests: () => dispatch(chooseTests()),
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
  setNegotiatedLanguages: negotiatedLanguages =>
    dispatch(setNegotiatedLanguages(negotiatedLanguages)),
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
    replaceState: (state, title, location) => window.history.replaceState(state, title, location),
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
