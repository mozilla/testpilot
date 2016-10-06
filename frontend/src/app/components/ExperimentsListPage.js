import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import EmailDialog from '../components/EmailDialog';
import ExperimentCardList from '../components/ExperimentCardList';
import LoadingPage from './LoadingPage';

export default class ExperimentsListPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hideEmailDialog: false };
  }

  render() {
    const { experiments, getCookie, removeCookie, getWindowLocation } = this.props;

    if (experiments.length === 0) { return <LoadingPage />; }

    let showEmailDialog = false;
    if (!this.state.hideEmailDialog &&
        (getCookie('first-run') ||
         getWindowLocation().search.indexOf('utm_campaign=restart-required') > -1)) {
      removeCookie('first-run');
      showEmailDialog = true;
    }

    return (
      <div>
        <Header {...this.props} />

        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ hideEmailDialog: true })} />}

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
          <div data-hook="experiment-list">
            <ExperimentCardList {...this.props} eventCategory="HomePage Interactions" />
          </div>
        </div>
        <footer id="main-footer" className="responsive-content-wrapper">
          <Footer {...this.props} />
        </footer>
      </div>
    );
  }
}

ExperimentsListPage.propTypes = {
  hasAddon: React.PropTypes.bool,
  getCookie: React.PropTypes.func,
  removeCookie: React.PropTypes.func,
  getWindowLocation: React.PropTypes.func,
  uninstallAddon: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func
};
