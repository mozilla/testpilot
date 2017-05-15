import React from 'react';

import LayoutWrapper from './LayoutWrapper';
import RetireConfirmationDialog from './RetireConfirmationDialog';
import Settings from './Settings';

export default class Header extends React.Component {

  constructor(props) {
    super(props);

    this.closeTimer = null;
    this.state = {
      showRetireDialog: false,
      showSettings: false
    };
  }

  shouldRenderSettingsMenu() {
    return this.props.hasAddon;
  }

  showSettingsMenu() {
    return this.state.showSettings;
  }

  close() {
    if (!this.state.showSettings) { return; }
    this.closeTimer = setTimeout(() =>
      this.setState({ showSettings: false }), 10);
  }

  renderSettingsMenu() {
    if (this.shouldRenderSettingsMenu()) {
      return (
        <Settings
          close={this.close.bind(this)}
          retire={this.retire.bind(this)}
          toggleSettings={this.toggleSettings.bind(this)}
          settingsClick={this.settingsClick.bind(this)}
          showSettingsMenu={this.showSettingsMenu.bind(this)}
          {...this.props}
         />
      );
    }
    return null;
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

  settingsClick() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); }
  }

  render() {
    return (
      <div>
        {this.renderRetireDialog()}
        <header id="main-header">
          <LayoutWrapper flexModifier="row-between-top">
            <h1>
              <a href="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
            </h1>
            {this.renderSettingsMenu()}
          </LayoutWrapper>
        </header>
      </div>
    );
  }

  toggleSettings(evt) {
    if (this.state.showSettings) {
      this.close(evt);
    } else {
      this.setState({ showSettings: true });
    }
  }

  retire() {
    this.setState({ showRetireDialog: true });
  }
}

Header.propTypes = {
  uninstallAddon: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired,
  openWindow: React.PropTypes.func.isRequired,
  hasAddon: React.PropTypes.any,
  forceHideSettings: React.PropTypes.bool
};
