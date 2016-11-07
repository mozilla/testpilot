import React from 'react';

import classnames from 'classnames';
import EmailDialog from '../components/EmailDialog';
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

        <div className="responsive-content-wrapper reverse-split-banner ">
          <div className="copter-wrapper fly-down">
            <div className="copter"></div>
          </div>
          <div className="intro-text">
            <h2 data-l10n-id="experimentListPageHeader" className="banner">Ready for Takeoff!</h2>
            <p data-l10n-id="experimentListPageSubHeader">Pick the features you want to try. <br /> Check back soon for more experiments.</p>
          </div>
        </div>

        <div className="pinstripe responsive-content-wrapper"></div>
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
