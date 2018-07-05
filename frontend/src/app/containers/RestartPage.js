// @flow

import { Localized } from "fluent-react/compat";
import React from "react";

import Banner from "../components/Banner";
import LayoutWrapper from "../components/LayoutWrapper";
import View from "../components/View";

type RestartProps = {
  experimentTitle: string,
  hasAddon: any,
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function
}

export default class Restart extends React.Component {
  props: RestartProps

  componentWillMount() {
    this.props.sendToGA("event", {
      eventCategory: "PostInstall Interactions",
      eventAction: "view modal",
      eventLabel: "restart required"
    });
  }

  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <Banner>
          <LayoutWrapper flexModifier="row-around-breaking">
            <div className="banner__copy">
              <Localized id="restartIntroLead">
                <span>Preflight checklist</span>
              </Localized>
              <ol className="banner__subtitle">
                <Localized id="restartIntroOne">
                  <li>Restart your browser</li>
                </Localized>
                <Localized id="restartIntroTwo">
                  <li>Locate the Test Pilot add-on</li>
                </Localized>
                <Localized id="restartIntroThree">
                  <li>Select your experiments</li>
                </Localized>
              </ol>
            </div>
          </LayoutWrapper>
        </Banner>
      </View>
    );
  }
}
