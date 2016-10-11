import React from 'react';

import Footer from '../components/Footer';
import MainInstallButton from '../components/MainInstallButton';
import ExperimentCardList from '../components/ExperimentCardList';
import LoadingPage from './LoadingPage';


export default class HomePageNoAddon extends React.Component {

  render() {
    const { experiments } = this.props;

    if (experiments.length === 0) { return <LoadingPage />; }

    return (
      <section data-hook="landing-page">
        <header id="main-header" className="responsive-content-wrapper">
          <h1>
            <a href="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
          </h1>
        </header>

        <div className="split-banner responsive-content-wrapper">
          <div className="copter-wrapper fly-up">
            <div className="copter"></div>
          </div>
          <div className="intro-text">
            <h2 className="banner">
              <span data-l10n-id="landingIntroLead" className="block lead-in">Go beyond . . . </span>
              <span data-l10n-id="landingIntroOne" className="block">Test new features.</span>
              <span data-l10n-id="landingIntroTwo" className="block">Give your feedback.</span>
              <span data-l10n-id="landingIntroThree" className="block">Help build Firefox.</span>
            </h2>
          </div>
        </div>

        <div className="centered-banner responsive-content-wrapper">
          <MainInstallButton {...this.props} eventCategory="HomePage Interactions" />
        </div>

        <div className="transparent-container">
          <div className="responsive-content-wrapper delayed-fade-in">
            <h2 className="card-list-header" data-l10n-id="landingExperimentsTitle">Try out the latest experimental features</h2>
            <div data-hook="experiment-list">
              <ExperimentCardList {...this.props} eventCategory="HomePage Interactions" />
            </div>
          </div>
        </div>

        <div className="responsive-content-wrapper delayed-fade-in">
          <h2 className="card-list-header" data-l10n-id="landingCardListTitle">Get started in 3 easy steps</h2>
          <div id="how-to" className="card-list">
            <div className="card">
              <div className="card-icon add-on-icon large"></div>
              <div className="card-copy large" data-l10n-id="landingCardOne">Get the Test Pilot add-on</div>
            </div>
            <div className="card">
              <div className="card-icon test-pilot-icon large"></div>
              <div className="card-copy large" data-l10n-id="landingCardTwo">Enable experimental features</div>
            </div>
            <div className="card">
              <div className="card-icon chat-icon large"></div>
              <div className="card-copy large" data-l10n-id="landingCardThree">Tell us what you think</div>
            </div>
          </div>

          <div className="centered-banner responsive-content-wrapper">
            <MainInstallButton {...this.props} eventCategory="HomePage Interactions" />
          </div>

        </div>
        <footer id="main-footer" className="responsive-content-wrapper">
          <Footer {...this.props} />
        </footer>
      </section>
    );
  }

}

HomePageNoAddon.propTypes = {
  hasAddon: React.PropTypes.bool,
  isFirefox: React.PropTypes.bool,
  experiments: React.PropTypes.array
};

