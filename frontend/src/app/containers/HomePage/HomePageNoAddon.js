// @flow
import { Localized } from "fluent-react/compat";
import React from "react";

import Banner from "../../components/Banner";
import Copter from "../../components/Copter";
import ExperimentCardList from "../../components/ExperimentCardList";
import LayoutWrapper from "../../components/LayoutWrapper";
import MainInstallButton from "../../components/MainInstallButton";
import PastExperiments from "../../components/PastExperiments";
import FeaturedExperiment from "../../components/FeaturedExperiment";
import View from "../../components/View";
import Visibility from "../../components/Visibility";

import type { InstalledExperiments } from "../../reducers/addon";

type HomePageNoAddonProps = {
  hasAddon: any,
  isFirefox: boolean,
  installed: InstalledExperiments,
  experiments: Array<Object>,
  featuredExperiments: Array<Object>,
  isAfterCompletedDate: Function,
  navigateTo: Function,
  isMinFirefox: boolean,
  isExperimentEnabled: Function,
  sendToGA: Function
}

export default class HomePageNoAddon extends React.Component {
  props: HomePageNoAddonProps

  render() {
    const { experiments, isAfterCompletedDate, featuredExperiments } = this.props;

    if (experiments.length === 0) { return null; }

    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));
    const pastExperiments = experiments.filter(isAfterCompletedDate);
    const featuredExperiment = featuredExperiments.length ? featuredExperiments[0] : false;

    const installSplash = <Banner>
      <LayoutWrapper flexModifier="row-center-breaking">
        <Copter small={true} animation="fly-up"/>
        <div className="banner__spacer" />
        <div>
          <Localized id="landingIntroOne">
            <h2 className="banner__title">Test new features.</h2>
          </Localized>
          <Localized id="landingIntroTwo">
            <h2 className="banner__title">Give your feedback.</h2>
          </Localized>
          <Localized id="landingIntroThree">
            <h2 className="banner__title">Help build Firefox.</h2>
          </Localized>
        </div>
      </LayoutWrapper>

      {!featuredExperiment && <MainInstallButton {...this.props}
        eventCategory="HomePage Interactions"
        eventLabel="Install the Add-on" />}
    </Banner>;

    const featuredSection = featuredExperiment ? (<Banner background={true}>
      <LayoutWrapper flexModifier="row-between-breaking">
        <FeaturedExperiment {...this.props}
          experiment={featuredExperiment}
          eventCategory="HomePage Interactions"
          enabled={false} />
      </LayoutWrapper>
    </Banner>) : null;

    const headerMessage = !featuredExperiment ? (<Localized id="experimentListHeader">
      <h1 className="emphasis card-list-heading">Pick your experiments</h1>
    </Localized>) :
      (<Localized id="experimentListHeaderWithFeatured">
        <h1 className="emphasis card-list-heading">Or try other experiments</h1>
      </Localized>);

    return (
      <section id="landing-page">
        <View {...this.props}>
          { installSplash }
          { featuredSection }
          <Visibility className="landingExperiments">
            <div className="moreButton">
              <a href="#experiments">More Experiments</a>
            </div>
            <Banner background={!featuredSection}>
              <LayoutWrapper flexModifier="column-center">
                <a name="experiments"></a>
                {headerMessage}
                <ExperimentCardList {...this.props} experiments={currentExperiments} eventCategory="HomePage Interactions" />
                <PastExperiments {...this.props} pastExperiments={ pastExperiments } />
              </LayoutWrapper>
            </Banner>
          </Visibility>

          <Banner background={!!featuredSection}>
            <Localized id="landingCardListTitle">
              <h2 className="banner__subtitle centered">Get started in 3 easy steps</h2>
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
