// @flow

import React from "react";
import { Localized } from "fluent-react/compat";

import View from "../../components/View";
import Copter from "../../components/Copter";
import LayoutWrapper from "../../components/LayoutWrapper";
import LocalizedHtml from "../../components/LocalizedHtml";

type UpgradeWarningProps = {
  sendToGA: Function,
  protocol: string,
  isMinFirefox: Boolean,
  isDevHost: Boolean,
  isProdHost: Boolean
}

export default class UpgradeWarning extends React.Component {
  props: UpgradeWarningProps

  componentWillMount() {
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
    let copy = (<LocalizedHtml id="warningGoToFAQDetail">
      <p>Something has gone wrong with Test Pilot. Please {" "}<a href="https://github.com/mozilla/testpilot/blob/master/docs/faq.md#whyi-is-test-pilot-telling-me-that-something-went-wrong">check the FAQs</a>{" "} to learn more.</p>
    </LocalizedHtml>);
    if (!isMinFirefox) {
      copy = (<LocalizedHtml id="warningUpgradeFirefoxDetail">
        <p>Test Pilot reqires the latest version of Firefox. <a href="https://www.mozilla.org/firefox/">Upgrade Firefox</a> to get started.</p>
      </LocalizedHtml>);
    } else if (protocol !== "https:") {
      copy = (<LocalizedHtml id="warningHttpsRequiredDetail">
        <p>Test Pilot must be accessed over HTTPS. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">
          our documentation</a> for details.</p></LocalizedHtml>);
    } else if (isDevHost) {
      copy = (<LocalizedHtml id="warningMissingPrefDetail">
        <p>When running Test Pilot locally or in development environments, special configuration is required. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">
              our documentation</a> for details.</p></LocalizedHtml>);
    } else if (!isProdHost) {
      copy = (<LocalizedHtml id="warningBadHostnameDetail">
        <p>The Test Pilot site may only be accessed from testpilot.firefox.com, testpilot.stage.mozaws.net, testpilot.dev.mozaws.net, or example.com:8000. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">
          our documentation</a> for details.</p></LocalizedHtml>);
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
