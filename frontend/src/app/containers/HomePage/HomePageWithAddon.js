/* eslint-disable */

// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';
import Banner from '../../components/Banner';
import Copter from '../../components/Copter';
import UpdateList from '../../components/UpdateList';
import EmailDialog from '../../components/EmailDialog';
import FeaturedExperiment from '../../components/FeaturedExperiment';
import ExperimentCardList from '../../components/ExperimentCardList';
import LayoutWrapper from '../../components/LayoutWrapper';
import MainInstallButton from '../../components/MainInstallButton';
import PastExperiments from '../../components/PastExperiments';
import View from '../../components/View';
import Visibility from "../../components/Visibility";
import LocalizedHtml from '../../components/LocalizedHtml';
import NewsUpdatesDialog from '../../components/NewsUpdatesDialog';
import type { InstalledExperiments } from '../../reducers/addon';

type HomePageWithAddonProps = {
  hasAddon: any,
  experiments: Array<Object>,
  installed: InstalledExperiments,
  featuredExperiments: Array<Object>,
  majorNewsUpdates: Array<Object>,
  freshNewsUpdates: Array<Object>,
  staleNewsUpdates: Array<Object>,
  getCookie: Function,
  removeCookie: Function,
  getWindowLocation: Function,
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function,
  isExperimentEnabled: Function,
  isAfterCompletedDate: Function,
  navigateTo: Function,
  isMinFirefox: boolean,
  isFirefox: boolean
}

type HomePageWithAddonState = {
  showEmailDialog: boolean,
  showNewsUpdateDialog: boolean
}

export default class HomePageWithAddon extends React.Component {
  props: HomePageWithAddonProps
  state: HomePageWithAddonState

  constructor(props: HomePageWithAddonProps) {
    super(props);

    this.state = {
      showEmailDialog: false,
      showNewsUpdateDialog: true
    };
  }

  componentDidMount() {
    const { getCookie, removeCookie, getWindowLocation } = this.props;

    if (getCookie('first-run') ||
      getWindowLocation().search.indexOf('utm_campaign=restart-required') > -1) {
      removeCookie('first-run');
      this.setState({showEmailDialog: true});
    }
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
    const { sendToGA, experiments, isAfterCompletedDate, staleNewsUpdates, freshNewsUpdates,
            majorNewsUpdates, featuredExperiments, isExperimentEnabled } = this.props;

    if (experiments.length === 0) { return null; }

    const { showEmailDialog, showNewsUpdateDialog } = this.state;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);
    const featuredExperiment = featuredExperiments.length ? featuredExperiments[0] : false;

    const featuredSection = featuredExperiment ? (<Banner background={true}>
      <LayoutWrapper flexModifier="row-center">
        <FeaturedExperiment {...this.props} experiment={featuredExperiment}
                            eventCategory="HomePage Interactions"
                            enabled={isExperimentEnabled(featuredExperiment)} />
      </LayoutWrapper>
    </Banner>) : null;

    const headerMessage = !featuredExperiment ? (<Localized id="experimentListHeader">
      <h1 className="emphasis card-list-heading">Pick your experiments</h1>
    </Localized>) :
    (<Localized id="experimentListHeaderWithFeatured">
      <h1 className="emphasis card-list-heading">Or try other experiments</h1>
     </Localized>);

    return (
      <View {...this.props}>
        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

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
        <Visibility className="landingExperiments">
          <div className="moreButton">
            <a href="#experiments">More Experiments</a>
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
