import React from 'react';

import Banner from '../components/Banner';
import Copter from '../components/Copter';
import ExperimentCardList from '../components/ExperimentCardList';
import LayoutWrapper from '../components/LayoutWrapper';
import LoadingPage from './LoadingPage';
import MainInstallButton from '../components/MainInstallButton';
import PastExperiments from '../components/PastExperiments';
import View from '../components/View';


export default class HomePageNoAddon extends React.Component {

  render() {
    const { experiments, isAfterCompletedDate } = this.props;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    if (experiments.length === 0) { return <LoadingPage />; }

    const installSplash = <Banner background={true}>

      <LayoutWrapper flexModifier="row-around-breaking">
      <Copter animation="fly-up"/>
        <div>
          <h2 className="banner__title emphasis" data-l10n-id="landingIntroOne">Test new features.</h2>
          <h2 className="banner__title emphasis" data-l10n-id="landingIntroTwo">Give your feedback.</h2>
          <h2 className="banner__title emphasis" data-l10n-id="landingIntroThree">Help build Firefox.</h2>
        </div>
      </LayoutWrapper>

      <LayoutWrapper flexModifier="column-center">
        <div className="centered">
          <MainInstallButton {...this.props} eventCategory="HomePage Interactions" eventLabel="Install the Add-on"/>
        </div>
      </LayoutWrapper>

    </Banner>;

    return (
      <section id="landing-page">
        <View {...this.props}>
          { installSplash }

          <Banner>
            <LayoutWrapper flexModifier="column-center">
              <h2 className="banner__subtitle emphasis centered" data-l10n-id="landingExperimentsTitle">Try out the latest experimental features</h2>
              <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
              <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
            </LayoutWrapper>
          </Banner>

          <Banner background={true}>
            <h2 className="banner__subtitle emphasis centered" data-l10n-id="landingCardListTitle">Get started in 3 easy steps</h2>
            <LayoutWrapper flexModifier="card-list" helperClass="card-list">
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
            </LayoutWrapper>
            <LayoutWrapper flexModifier="column-center">
              <div className="centered">
                <MainInstallButton {...this.props} eventCategory="HomePage Interactions" eventLabel="Install the Add-on"/>
              </div>
            </LayoutWrapper>
          </Banner>
        </View>
      </section>
    );
  }

}

HomePageNoAddon.propTypes = {
  hasAddon: React.PropTypes.any,
  isFirefox: React.PropTypes.bool,
  experiments: React.PropTypes.array,
  isAfterCompletedDate: React.PropTypes.func
};
