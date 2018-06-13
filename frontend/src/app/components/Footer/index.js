// @flow
import { Localized } from "fluent-react/compat";
import React from "react";

import RetireConfirmationDialog from "../RetireConfirmationDialog";

import "./index.scss";

type FooterProps = {
  hasAddon: any,
  sendToGA: Function,
  uninstallAddon: Function
}

type FooterState = {
  showRetireDialog: boolean
}

export default class Footer extends React.Component {
  props: FooterProps
  state: FooterState

  constructor(props: FooterProps) {
    super(props);

    this.state = {
      showRetireDialog: false
    };
  }

  dismissRetireDialog() {
    this.setState({
      showRetireDialog: false
    });
  }

  renderRetireDialog() {
    if (this.state.showRetireDialog) {
      return (
        <RetireConfirmationDialog
          onDismiss={this.dismissRetireDialog.bind(this)}
          {...this.props}
        />
      );
    }
    return null;
  }

  renderAboutSection() {
    return (
      <section className="footer-section">
        <Localized id="footerLinkAboutHeader">
          <h3>About</h3>
        </Localized>
        <Localized id="footerLinkAboutUs">
          <a href="/about" className="boilerplate">About us</a>
        </Localized>
        <Localized id="menuWiki">
          <a href="https://wiki.mozilla.org/Test_Pilot" className="boilerplate">Test Pilot Wiki</a>
        </Localized>
        <Localized id="headerLinkBlog">
          <a href="https://medium.com/firefox-test-pilot" className="boilerplate">Blog</a>
        </Localized>
      </section>
    );
  }

  renderSupportSection() {
    return (
      <section className="footer-section">
        <Localized id="footerLinkSupportHeader">
          <h3>Support</h3>
        </Localized>
        <Localized id="footerLinkFeedback">
          <a href="https://qsurvey.mozilla.com/s3/test-pilot-general-feedback" className="boilerplate">Give Feedback</a>
        </Localized>
        <Localized id="menuDiscuss">
          <a href="https://discourse.mozilla.org/c/test-pilot" className="boilerplate">Discuss Test Pilot</a>
        </Localized>
        <Localized id="menuFileIssue">
          <a href="https://github.com/mozilla/testpilot/issues/new" className="boilerplate">File an Issue</a>
        </Localized>
        <div className="social-links social-testpilot">
          <a onClick={(e) => this.eventToGA(e)} href="https://github.com/mozilla/testpilot"
            target="_blank" className="link-icon github"
            rel="noopener noreferrer" title="GitHub" alt="Testpilot GitHub Repo"></a>
          <a onClick={(e) => this.eventToGA(e)} href="https://twitter.com/FxTestPilot"
            target="_blank" rel="noopener noreferrer"
            className="link-icon twitter txp" title="Twitter" alt="Testpilot Twitter"></a>
        </div>
      </section>
    );
  }

  renderFirefoxSection() {
    return (
      <section className="footer-section">
        <Localized id="landingDownloadFirefoxTitle">
          <h3>Firefox</h3>
        </Localized>
        <Localized id="footerLinkDownload">
          <a href="https://www.mozilla.org/en-US/firefox/new/" className="boilerplate">Download Firefox</a>
        </Localized>
        <Localized id="footerLinkMobile">
          <a href="https://www.mozilla.org/en-US/firefox/mobile/" className="boilerplate">Mobile</a>
        </Localized>
        <Localized id="footerLinkFeatures">
          <a href="https://www.mozilla.org/en-US/firefox/features/" className="boilerplate">Features</a>
        </Localized>
        <Localized id="footerLinkBeta">
          <a href="https://www.mozilla.org/en-US/firefox/channel/desktop" className="boilerplate">Beta, Nightly, Developer Edition</a>
        </Localized>
        <div className="social-links social-firefox">
          <a onClick={(e) => this.eventToGA(e)} href="https://twitter.com/firefox"
            target="_blank" className="link-icon twitter fx"
            rel="noopener noreferrer" title="Firefox Twitter" alt="Firefox Twitter"></a>
          <a onClick={(e) => this.eventToGA(e)} href="https://www.youtube.com/firefoxchannel"
            target="_blank" rel="noopener noreferrer"
            className="link-icon youtube" title="Firefox YouTube Channel" alt="Firefox YouTube Channel"></a>
        </div>
      </section>
    );
  }

  render() {
    const { hasAddon } = this.props;
    return (
      <footer id="main-footer">
        {this.renderRetireDialog()}
        <div className="footer-container">
          <div className="footer-wrap">
            <section className="footer-section">
              <a href="https://www.mozilla.org" className="mozilla-logo" alt="Mozilla Site"></a>
            </section>
            {this.renderAboutSection()}
            {this.renderSupportSection()}
            {this.renderFirefoxSection()}
            {hasAddon && <section className="footer-section"><h3><Localized id="menuRetire">
              <a href="#" onClick={(e) => this.retire(e)} className="boilerplate uninstall-header" title="Uninstall Test Pilot">Uninstall Test Pilot</a>
            </Localized></h3></section>}
          </div>

          <div className="legal-links">
            <Localized id="footerLinkLegal">
              <a href="https://www.mozilla.org/about/legal/" className="boilerplate">Legal</a>
            </Localized>
            <Localized id="footerLinkPrivacy">
              <a href="/privacy" className="boilerplate">Privacy</a>
            </Localized>
            <Localized id="footerLinkTerms">
              <a href="/terms" className="boilerplate">Terms</a>
            </Localized>
            <Localized id="footerLinkCookies">
              <a href="https://www.mozilla.org/privacy/websites/#cookies" className="boilerplate">Cookies</a>
            </Localized>
          </div>
        </div>
      </footer>
    );
  }

  retire(e: Object) {
    e.preventDefault();
    this.props.sendToGA("event", {
      eventCategory: "FooterView Interactions",
      eventAction: "uninstall clicked",
      eventLabel: "Retire"
    });

    this.setState({ showRetireDialog: true });
  }

  eventToGA(e: Object) {
    const label = e.target.getAttribute("title");
    this.props.sendToGA("event", {
      eventCategory: "FooterView Interactions",
      eventAction: "social link clicked",
      eventLabel: label,
      outboundURL: e.target.href
    }, e);
  }
}
