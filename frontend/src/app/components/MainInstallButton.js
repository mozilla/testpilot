import classnames from 'classnames';
import { Localized } from 'fluent-react';
import React from 'react';

import LayoutWrapper from './LayoutWrapper';
import { VariantTests, VariantTestCase, VariantTestDefault } from './VariantTests';

import config from '../config';

export default class MainInstallButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isInstalling: false
    };
  }

  install(e) {
    const { requireRestart, sendToGA, eventCategory, eventLabel, hasAddon, installAddon, installCallback, navigateTo } = this.props;
    if (hasAddon) {
      navigateTo('/experiments');
      return;
    }
    if (installCallback) {
      this.setState({ isInstalling: true });
      installCallback(e);
      return;
    }
    this.setState({ isInstalling: true });
    installAddon(requireRestart, sendToGA, eventCategory, eventLabel)
      .then(() => navigateTo('/experiments'));
  }

  render() {
    const { isFirefox, isMinFirefox, isMobile, hasAddon } = this.props;
    const isInstalling = this.state.isInstalling && !hasAddon;

    return (
      <LayoutWrapper flexModifier="column-center-start-breaking">
        {(isMinFirefox && !isMobile) ? this.renderInstallButton(isInstalling, hasAddon) : this.renderAltButton(isFirefox, isMobile) }
        {isMinFirefox && !isMobile && <Localized id="landingLegalNotice">
          <p className="legal-information">
            By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot.
          </p>
        </Localized>}
      </LayoutWrapper>
    );
  }

  renderOneClickInstallButton(title) {
    return (
      <div className="default-btn-msg one-click-text">
        <Localized id="oneClickInstallMinorCta">
          <span className="minor-cta">Install Test Pilot &amp;</span>
        </Localized>
        <Localized id="oneClickInstallMajorCta" $title={title}>
          <span className="major-cta"></span>
        </Localized>
      </div>
    );
  }

  renderInstallButton(isInstalling, hasAddon) {
    const { experimentTitle } = this.props;
    let installButton = null;
    if (experimentTitle) {
      installButton = this.renderOneClickInstallButton(experimentTitle);
    } else {
      installButton = <Localized id="landingInstallButton">
        <span className="default-btn-msg">
          Install the Test Pilot Add-on
        </span>
      </Localized>;
    }
    const makeInstallButton = (extraClass = '') => {
      return <button onClick={e => this.install(e)}
        className={classnames(`button extra-large primary install ${extraClass}`, { 'state-change': isInstalling })}>
        {hasAddon && <Localized id="landingInstalledButton">
          <span className="progress-btn-msg">Installed</span>
        </Localized>}
        {!hasAddon && !isInstalling && installButton}
        {!hasAddon && isInstalling &&
          <Localized id="landingInstallingButton">
            <span className="progress-btn-msg">Installing...</span>
          </Localized>}
        <div className="state-change-inner"></div>
      </button>;
    };

    return <VariantTests name="installButtonBorder" varianttests={ this.props.varianttests }>
      <VariantTestCase value="bigBorder">
        { makeInstallButton('big-border') }
      </VariantTestCase>
      <VariantTestDefault>
        { makeInstallButton() }
      </VariantTestDefault>
    </VariantTests>;
  }

  renderAltButton(isFirefox, isMobile) {
    if (isFirefox && isMobile) {
      return (
        <div>
          <Localized id="landingRequiresDesktop">
            <span>Test Pilot requires Firefox for Desktop on Windows, Mac or Linux</span>
          </Localized>
        </div>
      );
    }
    return (
      <div>
          {!isFirefox ? (
              <Localized id="landingDownloadFirefoxDesc">
                <span className="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
              </Localized>
            ) : (
              <Localized id="landingUpgradeDesc2" $version={config.minFirefoxVersion}>
                <span className="parens">Test Pilot requires Firefox { config.minFirefoxVersion } or higher.</span>
              </Localized>
            )
          }
          {!isMobile && <a href="https://www.mozilla.org/firefox" className="button primary download-firefox">
            <div className="button-icon">
              <div className="button-icon-badge"></div>
            </div>
            <div className="button-copy">
              {(!isFirefox) ? (
                  <Localized id="landingDownloadFirefoxTitle">
                    <div className="button-title">Firefox</div>
                  </Localized>
                ) : (
                  <Localized id="landingUpgradeFirefoxTitle">
                    <div className="button-title">Upgrade Firefox</div>
                  </Localized>
                )
              }
              <Localized id="landingDownloadFirefoxSubTitle">
                <div className="button-description">Free Download</div>
              </Localized>
            </div>
          </a>}
      </div>
    );
  }
}
