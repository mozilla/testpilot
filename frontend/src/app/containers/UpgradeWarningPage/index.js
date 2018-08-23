// @flow

import React, { Component } from "react";
import { Localized } from "fluent-react/compat";

import View from "../../components/View";
import Copter from "../../components/Copter";
import LayoutWrapper from "../../components/LayoutWrapper";

type UpgradeWarningProps = {
  sendToGA: Function,
  protocol: string,
  isMinFirefox: Boolean,
  isDevHost: Boolean,
  isProdHost: Boolean
}

export default class UpgradeWarning extends Component<UpgradeWarningProps> {

  UNSAFE_componentWillMount() {
    this.props.sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "Upgrade Warning",
      eventLabel: "upgrade notice shown"
    });
  }

  renderTitle() {
    const { isMinFirefox, protocol, isProdHost, isDevHost } = this.props;
    let title = (<Localized id="warningGenericTitle">
      <span>Something is wrong!</span>
    </Localized>);
    if (!isMinFirefox) {
      title = (<Localized id="warningUpgradeFirefoxTitle">
        <span>Upgrade Firefox to continue!</span>
      </Localized>);
    } else if (protocol !== "https:") {
      title = (<Localized id="warningHttpsRequiredTitle">
        <span>HTTPS required!</span>
      </Localized>);
    } else if (isDevHost) {
      title = (<Localized id="warningMissingPrefTitle"><span>Developing Test Pilot?</span></Localized>);
    } else if (!isProdHost) {
      title = (<Localized id="warningBadHostnameTitle"><span>Unapproved hostname!</span></Localized>);
    }

    return title;
  }

  renderCopy() {
    const { isMinFirefox, protocol, isProdHost, isDevHost } = this.props;
    let copy = (<Localized id="warningGoToFAQDetail"
      a={<a href="https://github.com/mozilla/testpilot/blob/master/docs/faq.md#whyi-is-test-pilot-telling-me-that-something-went-wrong"/>}>
      <p>Something has gone wrong with Test Pilot. Please <a>check the FAQs</a> to learn more.</p>
    </Localized>);
    if (!isMinFirefox) {
      copy = (<Localized id="warningUpgradeFirefoxDetail"
        a={<a href="https://www.mozilla.org/firefox/"/>}>
        <p>Test Pilot reqires the latest version of Firefox. <a>Upgrade Firefox</a> to get started.</p>
      </Localized>);
    } else if (protocol !== "https:") {
      copy = (<Localized id="warningHttpsRequiredDetail"
        a={<a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md"/>}>
        <p>Test Pilot must be accessed over HTTPS. Please see <a>our documentation</a> for details.</p>
      </Localized>);
    } else if (isDevHost) {
      copy = (<Localized id="warningMissingPrefDetail"
        a={<a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md"/>}>
        <p>
          When running Test Pilot locally or in development environments, special configuration is required.
          Please see <a>our documentation</a> for details.
        </p>
      </Localized>);
    } else if (!isProdHost) {
      copy = (<Localized id="warningBadHostnameDetail"
        a={<a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md"/>}>
        <p>
          The Test Pilot site may only be accessed from testpilot.firefox.com, testpilot.stage.mozaws.net,
          testpilot.dev.mozaws.net, or example.com:8000. Please see <a>our documentation</a> for details.
        </p>
      </Localized>);
    }

    return copy;
  }

  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="warning" className="modal">
            <header className="modal-header-wrapper neutral-modal">
              <h1 className="modal-header">{ this.renderTitle() }</h1>
            </header>
            <div className="modal-content centered">{ this.renderCopy() }</div>
          </div>
          <Copter animation="fade-in-fly-up"/>
        </LayoutWrapper>
      </View>
    );
  }
}
