// @flow

import React from "react";
import { Localized } from "fluent-react/compat";

import LayoutWrapper from "../../components/LayoutWrapper";
import Banner from "../../components/Banner";
import Copter from "../../components/Copter";
import MainInstallButton from "../../components/MainInstallButton";

import type { TestpilotPromoProps } from "./types";

export default class TestpilotPromo extends React.Component {
  props: TestpilotPromoProps;

  render() {
    const { hasAddon, graduated, experiment } = this.props;

    const { title, web_url } = experiment;
    if (hasAddon === null || hasAddon || graduated || web_url) {
      return null;
    }
    return (
      <section id="testpilot-promo">
        <Banner>
          <LayoutWrapper flexModifier="row-between-reverse">
            <div className="intro-text">
              <h2 className="banner__title">
                <Localized id="experimentPromoHeader">
                  <span className="block">Ready for Takeoff?</span>
                </Localized>
              </h2>
              <Localized id="experimentPromoSubheader">
                <p className="banner__copy">
                  We&apos;re building next-generation features for Firefox.
                  Install Test Pilot to try them!
                </p>
              </Localized>
              <MainInstallButton
                {...this.props}
                experimentTitle={title}
              />
            </div>
            <Copter />
          </LayoutWrapper>
        </Banner>
      </section>
    );
  }
}
