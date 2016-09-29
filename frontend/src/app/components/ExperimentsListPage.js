import React from 'react';
import cookies from 'js-cookie';

import Header from '../components/Header';
import Footer from '../components/Footer';
import EmailDialog from '../components/EmailDialog';
import ExperimentCardList from '../components/ExperimentCardList';
import LoadingPage from './LoadingPage';

export default class ExperimentsListPage extends React.Component {

  constructor(props) {
    super(props);

    let showEmailDialog = false;
    if (cookies.get('first-run') ||
        window.location.search.indexOf('utm_campaign=restart-required') > -1) {
      cookies.remove('first-run');
      showEmailDialog = true;
    }

    this.state = {
      showEmailDialog
    };
  }

  render() {
    const { experiments } = this.props;
    const { showEmailDialog } = this.state;

    if (experiments.length === 0) { return <LoadingPage />; }

    return (
      <div>
        <Header {...this.props} />

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
