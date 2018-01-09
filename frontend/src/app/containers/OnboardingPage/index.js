import { Localized } from "fluent-react/compat";
import React from "react";

import Copter from "../../components/Copter";
import LayoutWrapper from "../../components/LayoutWrapper";
import View from "../../components/View";

import "./index.scss";

export default class OnboardingPage extends React.Component {
  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="onboarding" className="modal">
            <div className="modal-content centered">
              <div className="toolbar-button-onboarding"></div>
              <Localized id="onboardingMessage">
                <p>We put an icon in your toolbar so you can always find Test Pilot.</p>
              </Localized>
            </div>
          </div>
          <Copter animation="fade-in-fly-up"/>
        </LayoutWrapper>
      </View>
    );
  }
}
