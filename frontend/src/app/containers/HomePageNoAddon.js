import React from 'react';

import MainInstallButton from '../components/MainInstallButton';
import ExperimentCardList from '../components/ExperimentCardList';
import LoadingPage from './LoadingPage';
import PastExperiments from '../components/PastExperiments';
import View from '../components/View';


export default class HomePageNoAddon extends React.Component {

  render() {
    const { experiments, isAfterCompletedDate } = this.props;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    if (experiments.length === 0) { return <LoadingPage />; }

    return (
      <section id="landing-page">
        <View {...this.props}>
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
            <MainInstallButton {...this.props} eventCategory="HomePage Interactions" eventLabel="Install the Add-on"/>
          </div>

          <div className="transparent-container">
            <div className="responsive-content-wrapper delayed-fade-in">
              <h2 className="card-list-header" data-l10n-id="landingExperimentsTitle">Try out the latest experimental features</h2>
              <div>
                <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
                <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
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
              <MainInstallButton {...this.props} eventCategory="HomePage Interactions" eventLabel="Install the Add-on"/>
            </div>

          </div>
        </View>
      </section>
    );
  }

}

HomePageNoAddon.propTypes = {
  hasAddon: React.PropTypes.bool,
  isFirefox: React.PropTypes.bool,
  experiments: React.PropTypes.array,
  isAfterCompletedDate: React.PropTypes.func
};
