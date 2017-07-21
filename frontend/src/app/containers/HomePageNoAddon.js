// @flow
import { Localized } from 'fluent-react/compat';
import React from 'react';

import Banner from '../components/Banner';
import Copter from '../components/Copter';
import ExperimentCardList from '../components/ExperimentCardList';
import LayoutWrapper from '../components/LayoutWrapper';
import MainInstallButton from '../components/MainInstallButton';
import PastExperiments from '../components/PastExperiments';
import View from '../components/View';


type HomePageNoAddonProps = {
  hasAddon: any,
  isFirefox: boolean,
  experiments: Array<Object>,
  isAfterCompletedDate: Function,
  navigateTo: Function
}

export default class HomePageNoAddon extends React.Component {
  props: HomePageNoAddonProps

  render() {
    const { experiments, isAfterCompletedDate } = this.props;
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);

    if (experiments.length === 0) { return null; }
    if (this.props.hasAddon === true) {
      this.props.navigateTo('/experiments');
      return null;
    }

    const installSplash = <Banner background={true}>

      <LayoutWrapper flexModifier="row-around-breaking">
      <Copter animation="fly-up"/>
        <div>
          <Localized id="landingIntroOne">
            <h2 className="banner__title emphasis">Test new features.</h2>
          </Localized>
          <Localized id="landingIntroTwo">
            <h2 className="banner__title emphasis">Give your feedback.</h2>
          </Localized>
          <Localized id="landingIntroThree">
            <h2 className="banner__title emphasis">Help build Firefox.</h2>
          </Localized>
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
              <Localized id="landingExperimentsTitle">
                <h2 className="banner__subtitle emphasis centered">Try out the latest experimental features</h2>
              </Localized>
              <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
              <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
            </LayoutWrapper>
          </Banner>

          <Banner background={true}>
            <Localized id="landingCardListTitle">
              <h2 className="banner__subtitle emphasis centered">Get started in 3 easy steps</h2>
            </Localized>
            <LayoutWrapper flexModifier="card-list" helperClass="card-list">
              <div className="card">
                <div className="card-icon add-on-icon large"></div>
                <Localized id="landingCardOne">
                  <div className="card-copy large">Get the Test Pilot add-on</div>
                </Localized>
              </div>
              <div className="card">
                <div className="card-icon test-pilot-icon large"></div>
                <Localized id="landingCardTwo">
                  <div className="card-copy large">Enable experimental features</div>
                </Localized>
              </div>
              <div className="card">
                <div className="card-icon chat-icon large"></div>
                <Localized id="landingCardThree">
                  <div className="card-copy large">Tell us what you think</div>
                </Localized>
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
