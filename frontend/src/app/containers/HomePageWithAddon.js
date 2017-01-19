import React from 'react';

import classnames from 'classnames';
import EmailDialog from '../components/EmailDialog';
import CondensedHeader from '../components/CondensedHeader';
import ExperimentCardList from '../components/ExperimentCardList';
import LoadingPage from './LoadingPage';
import View from '../components/View';


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
      showEmailDialog,
      showPastExperiments: false
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

    const { showEmailDialog, showPastExperiments } = this.state;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    return (
      <View {...this.props}>
        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

        {this.renderSplash()}

        <div className="responsive-content-wrapper">
          <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
          {pastExperiments.length > 0 && !showPastExperiments &&
          <div className={classnames(['button', 'outline'])}
              style={{ margin: '0 auto 40px', display: 'table' }}
              onClick={() => this.setState({ showPastExperiments: true })}
              data-l10n-id="viewPastExperiments">View Past Experiments</div>}
          {showPastExperiments &&
          <div>
            <div className={classnames(['button', 'outline'])}
                style={{ margin: '0 auto 40px', display: 'table' }}
                onClick={() => this.setState({ showPastExperiments: false })}
                data-l10n-id="hidePastExperiments">Hide Past Experiments</div>
            <ExperimentCardList {...this.props} experiments={pastExperiments} eventCategory="HomePage Interactions" />
          </div>}
        </div>
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
