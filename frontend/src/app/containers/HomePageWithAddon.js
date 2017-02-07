/* eslint-disable */
import React from 'react';

import classnames from 'classnames';
import EmailDialog from '../components/EmailDialog';
import CondensedHeader from '../components/CondensedHeader';
import ExperimentCardList from '../components/ExperimentCardList';
import PastExperiments from '../components/PastExperiments';
import LoadingPage from './LoadingPage';
import View from '../components/View';

import { VariantTests, VariantTestCase, VariantTestDefault } from '../components/VariantTests.js';

export default class HomePageWithAddon extends React.Component {

  constructor(props) {
    super(props);
    const { getCookie, removeCookie, getWindowLocation } = this.props;

    let showEmailDialog = false;
    if (getCookie('first-run') ||
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
    if (window.location.search.includes('utm_content=no-experiments-installed')) {
      return (
        <div className="responsive-content-wrapper reverse-split-banner">
          <div className="copter-wrapper fly-down">
            <div className="copter"></div>
          </div>
          <div className="intro-text">
            <h2 data-l10n-id="experimentsListNoneInstalledHeader" className="banner">
              Let's get this baby off the ground!
            </h2>
            <p data-l10n-id="experimentsListNoneInstalledSubheader">
              Ready to try a new Test Pilot experiment? Select one to enable, take
              it for a spin, and let us know what you think.
            </p>
            <p data-l10n-id="experimentsListNoneInstalledCTA" className="cta">
              Not interested?
             <a onClick={() => this.onNotInterestedSurveyClick()}
                href="https://qsurvey.mozilla.com/s3/TxP-User" target="_blank">
              Let us know why
             </a>.
            </p>
          </div>
        </div>
      );
    }
    return (
      <CondensedHeader dataL10nId="experimentsListCondensedHeader">
        Pick your experiments!
      </CondensedHeader>
    );
  }

  render() {
    const { experiments, isAfterCompletedDate } = this.props;

    if (experiments.length === 0) { return <LoadingPage />; }

    const { showEmailDialog } = this.state;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    return (
      <View {...this.props}>
        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

        {this.renderSplash()}

        <VariantTests name="foo" varianttests={ this.props.varianttests }>
          <VariantTestCase value="blastoff">Ready for Blastoff!</VariantTestCase>
          <VariantTestCase value="houston">Houston, all systems are go.</VariantTestCase>
          <VariantTestDefault>Ready for Takeoff!</VariantTestDefault>
        </VariantTests>

        <div className="responsive-content-wrapper">
          <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
        </div>
        <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
      </View>
    );
  }
}

HomePageWithAddon.propTypes = {
  hasAddon: React.PropTypes.bool,
  getCookie: React.PropTypes.func,
  removeCookie: React.PropTypes.func,
  getWindowLocation: React.PropTypes.func,
  uninstallAddon: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func,
  isAfterCompletedDate: React.PropTypes.func
};
