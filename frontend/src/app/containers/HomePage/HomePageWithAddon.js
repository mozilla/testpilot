/* eslint-disable */
// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';
import Banner from '../../components/Banner';
import Copter from '../../components/Copter';
import UpdateList from '../../components/UpdateList';
import EmailDialog from '../../components/EmailDialog';
import ExperimentTourDialog from "../../components/ExperimentTourDialog";
import FeaturedExperiment from '../../components/FeaturedExperiment';
import ExperimentCardList from '../../components/ExperimentCardList';
import LayoutWrapper from '../../components/LayoutWrapper';
import PastExperiments from '../../components/PastExperiments';
import View from '../../components/View';
import Visibility from "../../components/Visibility";
import LocalizedHtml from '../../components/LocalizedHtml';
import NewsUpdatesDialog from '../../components/NewsUpdatesDialog';
import type { InstalledExperiments } from '../../reducers/addon';
import { getBreakpoint } from "../App";

type HomePageWithAddonProps = {
  hasAddon: any,
  experiments: Array<Object>,
  experimentsWithoutFeatured: Array<Object>,
  installed: InstalledExperiments,
  featuredExperiments: Array<Object>,
  majorNewsUpdates: Array<Object>,
  freshNewsUpdates: Array<Object>,
  staleNewsUpdates: Array<Object>,
  getCookie: Function,
  setCookie: Function,
  removeCookie: Function,
  getWindowLocation: Function,
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function,
  isExperimentEnabled: Function,
  isAfterCompletedDate: Function,
  enableExperiment: Function,
  navigateTo: Function,
  isMinFirefox: boolean,
  isFirefox: boolean
}

type HomePageWithAddonState = {
  showEmailDialog: boolean,
  showNewsUpdateDialog: boolean,
  showTourDialog: boolean
}

export default class HomePageWithAddon extends React.Component {
  props: HomePageWithAddonProps
  state: HomePageWithAddonState

  constructor(props: HomePageWithAddonProps) {
    super(props);

    this.state = {
      showEmailDialog: false,
      showTourDialog: false,
      showNewsUpdateDialog: true
    };
  }

  checkCookies() {
    const { getCookie, removeCookie, featuredExperiments } = this.props;
    const exp = getCookie("exp-installed");
    const featured = featuredExperiments[0];

    if (getCookie("txp-installed")) {
      removeCookie("txp-installed");
      this.setState({ showEmailDialog: true })
    } else if (exp && !this.state.showEmailDialog) {
      if (featured && featured.addon_id === exp) {
        removeCookie("exp-installed");
        this.setState({ showTourDialog: true });
      }
    }
  }

  componentWillMount() {
    this.checkCookies();
  }

  componentDidUpdate() {
    this.checkCookies();
  }

  onTourDialogComplete = (featuredExperiment: Object, cancel?: boolean) => {
    const { isExperimentEnabled, hasAddon, installed, sendToGA } = this.props;
    const { slug, title } = featuredExperiment;
    this.setState({ showTourDialog: false });
    sendToGA("event", {
      eventCategory: "FeaturedExperiment Interactions",
      eventAction: "button click",
      eventLabel: cancel ? "cancel tour" : "complete tour",
      dimension1: hasAddon,
      dimension2: Object.keys(installed).length > 0,
      dimension3: Object.keys(installed).length,
      dimension4: isExperimentEnabled(featuredExperiment),
      dimension5: title,
      dimension10: getBreakpoint(window.innerWidth),
      dimension11: slug,
      dimension13: "Featured Experiment"
    });
  }

  onNotInterestedSurveyClick() {
    this.props.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'no experiments no thank you'
    });
  }

  renderSplash() {
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.search.includes('utm_content=no-experiments-installed')) {
      return (
        <Banner background={true}>
          <LayoutWrapper flexModifier="row-between-breaking">
            <div className="banner__copy">
              <Localized id="experimentsListNoneInstalledHeader">
                <h2 className="banner__subtitle">
                  Let&apos;s get this baby off the ground!
                </h2>
              </Localized>
              <Localized id="experimentsListNoneInstalledSubheader">
                <p className="banner__copy">
                  Ready to try a new Test Pilot experiment? Select one to enable, take
                  it for a spin, and let us know what you think.
                </p>
              </Localized>
              <LocalizedHtml id="experimentsListNoneInstalledCTA">
                <p className="banner__copy">
                  Not interested?
                  <a onClick={() => this.onNotInterestedSurveyClick()}
                     href="https://qsurvey.mozilla.com/s3/TxP-User" target="_blank"
                     className="banner__link">
                   Let us know why
                  </a>.
                </p>
              </LocalizedHtml>
            </div>
            <div className="banner__spacer" />
            <Copter/>
          </LayoutWrapper>
        </Banner>
      );
    }
    return (
      <Banner condensed={true}>
      <LayoutWrapper flexModifier="row-between-reverse">
        <Localized id="experimentCondensedHeader">
          <h2 className="banner__title">
            Welcome to Test Pilot!
          </h2>
        </Localized>
        <Copter small={true} />
      </LayoutWrapper>
      </Banner>
    );
  }

  render() {
    const { sendToGA, isAfterCompletedDate, staleNewsUpdates, freshNewsUpdates,
            majorNewsUpdates, featuredExperiments, isExperimentEnabled,
            experimentsWithoutFeatured, experiments,
            enableExperiment } = this.props;

    if (experimentsWithoutFeatured.length === 0) { return null; }

    const { showEmailDialog, showNewsUpdateDialog, showTourDialog } = this.state;
    const currentExperiments = experimentsWithoutFeatured.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experimentsWithoutFeatured.filter(isAfterCompletedDate);
    const featuredExperiment = featuredExperiments[0];

    const featuredSection = featuredExperiment ? (<Banner background={true}>
      <LayoutWrapper flexModifier="row-center">
        <FeaturedExperiment {...this.props} experiment={featuredExperiment}
                            eventCategory="FeaturedExperiment Interactions"
                            enableExperiment={enableExperiment}
                            enabled={isExperimentEnabled(featuredExperiment)} />
      </LayoutWrapper>
    </Banner>) : null;

    const headerMessage = !featuredExperiment ? (<Localized id="experimentListHeader">
      <h1 className="emphasis card-list-heading">Pick your experiments</h1>
    </Localized>) :
    (<Localized id="experimentListHeaderWithFeatured">
      <h1 className="emphasis card-list-heading">Or try other experiments</h1>
     </Localized>);

    const onEmailDialogDismissed = () => {
      this.setState({ showEmailDialog: false });
    };

    return (
      <View {...this.props}>
        {showEmailDialog &&
          <EmailDialog {...this.props} onDismiss={onEmailDialogDismissed} />}
        {showTourDialog && <ExperimentTourDialog
            experiment={featuredExperiment}
            {...this.props}
            onCancel={() => this.onTourDialogComplete(featuredExperiment, true)}
            onComplete={() => this.onTourDialogComplete(featuredExperiment)}
          />}
      {this.renderSplash()}
      {featuredSection}

      {showNewsUpdateDialog && majorNewsUpdates.length ? (
          <NewsUpdatesDialog {...this.props} newsUpdates={majorNewsUpdates}
                             currentExperiments={currentExperiments}
                             onCancel={() => this.setState({ showNewsUpdateDialog: false })}
                             onComplete={() => this.setState({ showNewsUpdateDialog: false })} />) : null}

        <LayoutWrapper flexModifier="card-list">
          {!featuredExperiment &&
            <UpdateList {...{ sendToGA, staleNewsUpdates, freshNewsUpdates, experiments }} />}
        </LayoutWrapper>
        <Visibility className="landing-experiments">
          <div className="more-button">
            <Localized id="landingMoreExperimentsButton">
              <a className="arrow" href="#experiments">More Experiments</a>
            </Localized>
          </div>
          <Banner>
            <LayoutWrapper>
              <a name="experiments"></a>
              {headerMessage}
              <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
              <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
            </LayoutWrapper>
          </Banner>
        </Visibility>
      </View>
    );
  }
}
