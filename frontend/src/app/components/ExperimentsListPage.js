import React from 'react';
import cookies from 'js-cookie';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import ExperimentRowCard from '../components/ExperimentRowCard';
import EmailDialog from '../components/EmailDialog';

export default class ExperimentsListPage extends React.Component {

  constructor(props) {
    super(props);

    let showEmailDialog = false;
    if (cookies.get('first-run')) {
      cookies.remove('first-run');
      showEmailDialog = true;
    }

    this.state = {
      showEmailDialog
    };
  }

  render() {
    const { navigateTo, experiments, isExperimentEnabled, hasAddon } = this.props;
    const { showEmailDialog } = this.state;

    return (
      <div>

          {showEmailDialog &&
            <EmailDialog onDismiss={() => this.setState({ showEmailDialog: false })} />}

          <Header />
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
              <div className="card-list experiments">
                {(experiments.length === 0) ?
                  <Loading /> :
                  experiments.map((experiment, key) =>
                    <ExperimentRowCard key={key} navigateTo={navigateTo}
                                       hasAddon={hasAddon} experiment={experiment}
                                       enabled={isExperimentEnabled(experiment)}
                                       eventCategory="HomePage Interactions" />)}
              </div>
            </div>
          </div>
          <footer id="main-footer" className="responsive-content-wrapper">
            <Footer />
          </footer>
      </div>
    );
  }
}
