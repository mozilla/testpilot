/* global ga */
/*
This is the toplevel container for Test Pilot. It does too much and it would
be nice to move parts of this into other modules.

When the page is rendered, it:

- starts by rendering Loading
- Checks to see if restartRequired (see below)
- Sets the title using Hemlet (but doesn't localize it -- this code is
  redundant with the title element in the static html and should probably be
  removed)
- Wraps children of App with LocalizationProvider, allowing use of fluent-react
  for localization

Then, in componentDidMount it:

- Chooses variant tests, placing the user in a particular group for any
  varianttests (there aren't any)
- Calls measurePageview. The implementation of measurePageview should
  move into lib/utils.
- Negotiates the language and triggers the translation with fluent-react.
- Finally, it sets loading to false, causing the full page to render.

restartRequired is very old code. We have not required a restart in a long
time. It can be removed.

  https://github.com/mozilla/testpilot/issues/3571

Helmet is not doing anything but increase our bundle size. We could either
just remove it, or fix it so that it works with fluent-react to properly
localize the title.

  https://github.com/mozilla/testpilot/issues/3572

mapStateToProps and mapDispatchToProps is implemented for the entire
application here. For better performance and separation of concerns, it
would be better to split out a different map*ToProps for each Container,
not just the toplevel App Container.

  https://github.com/mozilla/testpilot/issues/2924
*/

import { MessageContext } from "fluent/compat";
import { negotiateLanguages } from "fluent-langneg/compat";
import { LocalizationProvider } from "fluent-react/compat";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import cookies from "js-cookie";
import Clipboard from "clipboard";

import likelySubtagsData from "cldr-core/supplemental/likelySubtags.json";

import { getInstalled, isExperimentEnabled, isAfterCompletedDate, isInstalledLoaded } from "../../reducers/addon";
import { getExperimentBySlug } from "../../reducers/experiments";
import { getChosenTest } from "../../reducers/varianttests";
import experimentSelector, { featuredExperimentsSelectorWithL10n, experimentsWithoutFeaturedSelectorWithL10n } from "../../selectors/experiment";
import { uninstallAddon, installAddon, enableExperiment, disableExperiment } from "../../lib/InstallManager";
import { setLocalizations, setNegotiatedLanguages } from "../../actions/localizations";
import { localizationsSelector, negotiatedLanguagesSelector } from "../../selectors/localizations";
import { chooseTests } from "../../actions/varianttests";
import addonActions from "../../actions/addon";
import newsletterFormActions from "../../actions/newsletter-form";
import RestartPage from "../RestartPage";
import UpgradeWarningPage from "../UpgradeWarningPage";
import Loading from "../../components/Loading";
import {
  shouldOpenInNewTab,
  fetchCountryCode
} from "../../lib/utils";
import {
  makeNewsUpdatesForDialogSelector
} from "../../selectors/news";
import config from "../../config";

let clipboard = null;
if (typeof document !== "undefined") {
  clipboard = new Clipboard("button");
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
    this.state = {
      loading: true
    };
  }

  measurePageview() {
    const { hasAddon, installed, installedLoaded } = this.props;

    // If we have an addon, wait until the installed experiments are loaded
    if (hasAddon && !installedLoaded) { return; }

    const pathname = window.location.pathname;

    const experimentsPath = "experiments/";

    if (pathname === "/") {
      const installedCount = Object.keys(installed).length;
      const anyInstalled = installedCount > 0;
      this.debounceSendToGA(pathname, "pageview", {
        dimension1: hasAddon,
        dimension2: anyInstalled,
        dimension3: installedCount
      });
    } else if (pathname === experimentsPath) {
      this.debounceSendToGA(pathname, "pageview", {
        dimension1: hasAddon
      });
    } else if (pathname.indexOf(experimentsPath) === 0) {
      let slug = pathname.substring(experimentsPath.length);
      // Trim trailing slash, if necessary
      if (slug.charAt(slug.length - 1) === "/") {
        slug = slug.substring(0, slug.length - 1);
      }
      const experiment = this.props.getExperimentBySlug(slug);
      this.debounceSendToGA(pathname, "pageview", {
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
      ga("send", data);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path) {
      window.scrollTo(0, 0);
    }
  }

  componentDidMount() {
    this.props.chooseTests();
    this.measurePageview();

    const lang = window.navigator.language;

    // set lang attr on <html> for a11y
    document.documentElement.setAttribute("lang", lang);

    // we should expand upon this in the future, but this should get us
    // working for arabic
    document.documentElement.setAttribute("dir", (lang === "ar" ? "rtl" : "ltr"));

    const langs = {};

    function addLang(lang, response) {
      if (response.ok) {
        return response.text().then(data => {
          langs[lang] = `${langs[lang] || ""}${data}`;
        });
      }
      return Promise.resolve();
    }

    const availableLanguages = document.querySelector(
      "meta[name=availableLanguages]").content.split(",");

    const negotiated = negotiateLanguages(
      navigator.languages,
      availableLanguages,
      {
        defaultLocale: "en-US",
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
      this.setState({ loading: false });
      this.props.setLocalizations(langs);
      const staticNode = document.getElementById("static-root");
      if (staticNode) {
        staticNode.remove();
      }
    });
  }

  shouldShowUpgradeWarning() {
    const { hasAddon, hasAddonManager, host, isFirefox } = this.props;
    return shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox, host);
  }

  render() {
    const { restart } = this.props.addon;
    const { loading } = this.state;
    if (loading) {
      return (<div className="full-page-wrapper centered overflow-hidden">
        <Loading/>
      </div>);
    }
    if (restart.isRequired) {
      return <RestartPage {...this.props} />;
    }

    if (this.shouldShowUpgradeWarning()) {
      return <UpgradeWarningPage {...this.props} />;
    }

    function* generateMessages(languages, localizations) {
      for (const lang of languages) {
        if (typeof localizations[lang] === "string") {
          const cx = new MessageContext(lang, {useIsolating: false});
          cx.addMessages(localizations[lang]);
          yield cx;
        }
      }
    }

    return <div>
      <Helmet>
        <title>Firefox Test Pilot</title>
      </Helmet>
      <LocalizationProvider messages={ generateMessages(
        this.props.negotiatedLanguages,
        this.props.localizations
      ) }>
        { React.cloneElement(this.props.children, this.props) }
      </LocalizationProvider>
    </div>;
  }
}

// These mirror breakpoints defined in frontend/src/styles/_utils.scss:$breakpoints
export const BREAKPOINTS = {
  BIG: "big",
  MEDIUM: "medium",
  SMALL: "small",
  MOBILE: "mobile"
};
export const getBreakpoint = width => {
  if (width >= 1020) {
    return BREAKPOINTS.BIG;
  } else if (width >= 769) {
    return BREAKPOINTS.MEDIUM;
  } else if (width >= 521) {
    return BREAKPOINTS.SMALL;
  }
  return BREAKPOINTS.MOBILE;
};

/*
Pings GA with the passed hitType and event data.

Parameters:
- type: indicates the type of event being reported to GA. One of 'pageview',
  'screenview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'.
- dataIn: an object representing the event with some of the following
  properties:
    - eventCategory
    - eventAction
    - eventLabel
    - outboundURL - a URL to which the browser should navigate after ensuring
      that the event has been received by GA. It is done this way to prevent a
      race condition between the logging of the event and the navigation to
      another page. If outboundURL is provided here, evt must also be provided
      in order to determine if the user would like this URL to open in a news
      tab.
- evt: the browser event that triggered the GA ping.
*/
function sendToGA(type, dataIn, evt = null) {
  const data = dataIn || {};
  if (data.outboundURL && !evt) {
    throw "If outboundURL is defined, you must also provide the click event.";
  }
  const openInNewTab = evt && shouldOpenInNewTab(evt);

  // If we'll be opening a URL in the same tab, stop the navigation event from
  // happening until after we've ensured that the GA ping has been logged.
  if (data.outboundURL && openInNewTab === false) {
    evt.preventDefault();
  }

  const hitCallback = () => {
    if (data.outboundURL && openInNewTab === false) {
      document.location = data.outboundURL;
    }
  };
  if (window.ga && ga.loaded) {
    const chosenTest = getChosenTest();
    data.hitType = type;
    data.hitCallback = hitCallback;
    data.dimension8 = chosenTest.test;
    data.dimension9 = chosenTest.variant;
    data.dimension10 = getBreakpoint(window.innerWidth);
    ga("send", data);
  } else {
    hitCallback();
  }
}

const mapStateToProps = state => ({
  addon: state.addon,
  clientUUID: state.addon.clientUUID,
  experiments: experimentSelector(state),
  experimentsWithoutFeatured: experimentsWithoutFeaturedSelectorWithL10n(state),
  featuredExperiments: featuredExperimentsSelectorWithL10n(state),
  fetchCountryCode: fetchCountryCode,
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
  majorNewsUpdates: makeNewsUpdatesForDialogSelector(
    cookies.get("updates-last-viewed-date"),
    Date.now()
  )(state),
  negotiatedLanguages: negotiatedLanguagesSelector(state),
  newsletterForm: state.newsletterForm,
  protocol: state.browser.protocol,
  routing: state.routing,
  varianttests: state.varianttests
});


const mapDispatchToProps = dispatch => ({
  chooseTests: () => dispatch(chooseTests()),
  enableExperiment: (experiment, eventCategory, eventLabel) => enableExperiment(dispatch, experiment, sendToGA, eventCategory, eventLabel),
  disableExperiment: experiment => disableExperiment(dispatch, experiment),
  setHasAddon: installed => dispatch(addonActions.setHasAddon(installed)),
  newsletterForm: {
    setEmail: email =>
      dispatch(newsletterFormActions.newsletterFormSetEmail(email)),
    setPrivacy: privacy =>
      dispatch(newsletterFormActions.newsletterFormSetPrivacy(privacy)),
    subscribe: (email) =>
      dispatch(newsletterFormActions.newsletterFormSubscribe(dispatch, email, "" + window.location))
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
      if (typeof document === "undefined") { return; }

      const title = document.querySelector("head title");
      title.setAttribute("data-l10n-id", id);
      title.setAttribute("data-l10n-args", JSON.stringify(args));
    },
    openWindow: (href, name) => window.open(href, name),
    getWindowLocation: () => window.location,
    addScrollListener: listener =>
      window.addEventListener("scroll", listener),
    removeScrollListener: listener =>
      window.removeEventListener("scroll", listener),
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
    setCookie: (name, value) => cookies.set(name, value),
    removeCookie: name => cookies.remove(name)
  }, ownProps, stateProps, dispatchProps, {
    newsletterForm
  });
};


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
