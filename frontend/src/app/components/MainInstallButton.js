import React from 'react';
import classnames from 'classnames';
import { VariantTests, VariantTestCase, VariantTestDefault } from './VariantTests';

import LayoutWrapper from './LayoutWrapper';

export default class MainInstallButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isInstalling: false
    };
  }

  install(e) {
    const { requireRestart, sendToGA, eventCategory, eventLabel, hasAddon, installAddon, installCallback } = this.props;
    if (installCallback) {
      this.setState({ isInstalling: true });
      installCallback(e);
      return;
    }
    if (hasAddon) { return; }
    this.setState({ isInstalling: true });
    installAddon(requireRestart, sendToGA, eventCategory, eventLabel);
  }

  render() {
    const { isFirefox, isMinFirefox, isMobile, hasAddon } = this.props;
    const isInstalling = this.state.isInstalling && !hasAddon;

    return (
      <LayoutWrapper flexModifier="column-center-start-breaking">
        {(isMinFirefox && !isMobile) ? this.renderInstallButton(isInstalling, hasAddon) : this.renderAltButton(isFirefox, isMobile) }
        {isMinFirefox && !isMobile && <p data-l10n-id="landingLegalNotice" className="legal-information">By proceeding,
          you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>}
      </LayoutWrapper>
    );
  }

  renderOneClickInstallButton(title) {
    return (
      <div className="default-btn-msg one-click-text">
        <span className="minor-cta" data-l10n-id="oneClickInstallMinorCta" >Install Test Pilot &amp;</span>
        <span className="major-cta" data-l10n-id="oneClickInstallMajorCta" data-l10n-args={ JSON.stringify({ title: title }) }></span>
      </div>
    );
  }

  renderInstallButton(isInstalling, hasAddon) {
    const { experimentTitle } = this.props;
    let installButton = null;
    if (experimentTitle) {
      installButton = this.renderOneClickInstallButton(experimentTitle);
    } else {
      installButton = <span className="default-btn-msg" data-l10n-id="landingInstallButton">
      </span>;
    }
    const makeInstallButton = (extraClass = '') => {
      return <button onClick={e => this.install(e)}
        className={classnames(`button extra-large primary install ${extraClass}`, { 'state-change': isInstalling })}>
        {hasAddon && <span className="progress-btn-msg" data-l10n-id="landingInstalledButton">Installed</span>}
        {!hasAddon && !isInstalling && installButton}
        {!hasAddon && isInstalling &&
          <span className="progress-btn-msg" data-l10n-id="landingInstallingButton">Installing...</span>}
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
          <span data-l10n-id="landingRequiresDesktop">Test Pilot requires Firefox for Desktop on Windows, Mac or Linux</span>
        </div>
      );
    }
    return (
      <div>
          {!isFirefox ? (
              <span data-l10n-id="landingDownloadFirefoxDesc" className="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
            ) : (
              <span className="parens" data-l10n-id="landingUpgradeDesc">Test Pilot requires Firefox 49 or higher.</span>
            )
          }
          {!isMobile && <a href="https://www.mozilla.org/firefox" className="button primary download-firefox">
            <div className="button-icon">
              <div className="button-icon-badge"></div>
            </div>
            <div className="button-copy">
              {(!isFirefox) ? (
                  <div data-l10n-id="landingDownloadFirefoxTitle" className="button-title">Firefox</div>
                ) : (
                  <div data-l10n-id="landingUpgradeFirefoxTitle" className="button-title">Upgrade Firefox</div>
                )
              }
              <div data-l10n-id="landingDownloadFirefoxSubTitle" className="button-description">Free Download</div>
            </div>
          </a>}
      </div>
    );
  }
}
