/* eslint-disable */

// @flow

import React from 'react';
import classnames from 'classnames';

import Banner from '../components/Banner';
import Copter from '../components/Copter';
import UpdateList from '../components/UpdateList';
import EmailDialog from '../components/EmailDialog';
import ExperimentCardList from '../components/ExperimentCardList';
import LayoutWrapper from '../components/LayoutWrapper';
import MainInstallButton from '../components/MainInstallButton';
import PastExperiments from '../components/PastExperiments';
import View from '../components/View';


type HomePageWithAddonProps = {
  hasAddon: any,
  experiments: Array<Object>,
  newsUpdates: Array<Object>,
  getCookie: Function,
  removeCookie: Function,
  getWindowLocation: Function,
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function,
  isAfterCompletedDate: Function
}

type HomePageWithAddonState = {
  showEmailDialog: boolean
}

export default class HomePageWithAddon extends React.Component {
  props: HomePageWithAddonProps
  state: HomePageWithAddonState

  constructor(props: HomePageWithAddonProps) {
    super(props);
    const { getCookie, removeCookie, getWindowLocation } = this.props;

    let showEmailDialog = false;
    if (getCookie('first-run') ||
      typeof window !== 'undefined' &&
      getWindowLocation().search.indexOf('utm_campaign=restart-required') > -1) {
      removeCookie('first-run');
      showEmailDialog = true;
    }

    this.state = {
      showEmailDialog
    };
  }

  onNotInterestedSurveyClick() {
    this.props.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'no experiments no thank you'
    });
  }

  renderSplash() {
    if (typeof window !== 'undefined' && window.location.search.includes('utm_content=no-experiments-installed')) {
      return (
        <Banner background={true}>
          <LayoutWrapper flexModifier="row-between-breaking">
          <div className="banner__copy">
            <h2 data-l10n-id="experimentsListNoneInstalledHeader" className="banner__subtitle">
              Let's get this baby off the ground!
            </h2>
            <p data-l10n-id="experimentsListNoneInstalledSubheader">
              Ready to try a new Test Pilot experiment? Select one to enable, take
              it for a spin, and let us know what you think.
            </p>
            <p data-l10n-id="experimentsListNoneInstalledCTA">
              Not interested?
             <a onClick={() => this.onNotInterestedSurveyClick()}
                href="https://qsurvey.mozilla.com/s3/TxP-User" target="_blank"
                className="banner__link">
              Let us know why
             </a>.
            </p>
            </div>
            <Copter/>
          </LayoutWrapper>
        </Banner>
      );
    }
    return (
      <Banner condensed={true}>
      <LayoutWrapper flexModifier="row-between-reverse">
        <h2 className="banner__title" data-l10n-id="experimentCondensedHeader">
          Welcome to Test Pilot!
        </h2>
        <Copter small={true} />
      </LayoutWrapper>
      </Banner>
    );
  }

  render() {
    const { experiments, isAfterCompletedDate, newsUpdates } = this.props;

    if (experiments.length === 0) { return null; }

    const { showEmailDialog } = this.state;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    return (
      <View {...this.props}>
        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

        {this.renderSplash()}

        <LayoutWrapper flexModifier="card-list">
          <UpdateList {...{ newsUpdates, experiments }} />
          <h1 className="emphasis card-list-heading" data-l10n-id="experimentListHeader">Pick your experiments!</h1>
          <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
          <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
        </LayoutWrapper>
      </View>
    );
  }
}
