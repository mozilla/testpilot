import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { installAddon } from '../lib/addon';

export default class MainInstallButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isInstalling: false
    };
  }

  install() {
    const { eventCategory, hasAddon } = this.props;
    if (hasAddon) { return; }
    this.setState({ isInstalling: true });
    installAddon(this.context.store, eventCategory);
  }

  render() {
    const { isFirefox, hasAddon } = this.props;
    const isInstalling = this.state.isInstalling && !hasAddon;

    return (
      <div>
        {(!isFirefox) ? (
          <div>
              <span data-l10n-id="landingDownloadFirefoxDesc" className="parens">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
              <a href="https://www.mozilla.org/firefox" className="button primary download-firefox">
                <div className="button-icon">
                  <div className="button-icon-badge"></div>
                </div>
                <div className="button-copy">
                  <div data-l10n-id="landingDownloadFirefoxTitle" className="button-title">Firefox</div>
                  <div data-l10n-id="landingDownloadFirefoxSubTitle" className="button-description">Free Download</div>
                </div>
              </a>
          </div>
        ) : (
          <div>
            <button onClick={e => this.install(e)} data-hook="install"
                    className={classnames('button extra-large primary install', { 'state-change': isInstalling })}>
              {hasAddon && <span className="progress-btn-msg" data-l10n-id="landingInstallingButton">Installed</span>}
              {!hasAddon && !isInstalling &&
                <span className="default-btn-msg" data-l10n-id="landingInstallButton">Install the Test Pilot Add-on</span>}
              {!hasAddon && isInstalling &&
                <span className="progress-btn-msg" data-l10n-id="landingInstallingButton">Installing...</span>}
              <div className="state-change-inner"></div>
            </button>
          </div>
        )}
        {isFirefox && <p data-l10n-id="landingLegalNotice" className="legal-information">By proceeding,
          you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot</p>}
      </div>
    );
  }
}

MainInstallButton.contextTypes = {
  store: PropTypes.object.isRequired
};
