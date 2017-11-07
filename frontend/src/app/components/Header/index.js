// @flow

import { Localized } from 'fluent-react/compat';
import React from 'react';

import LayoutWrapper from '../LayoutWrapper';
import RetireConfirmationDialog from '../RetireConfirmationDialog';
import Settings from '../Settings';

import './index.scss';

type HeaderProps = {
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function,
  hasAddon: any,
  forceHideSettings: boolean
}

type HeaderState = {
  showRetireDialog: boolean,
  showSettings: boolean
}

export default class Header extends React.Component {
  props: HeaderProps
  state: HeaderState
  closeTimer: any

  constructor(props: HeaderProps) {
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

  setHeaderLinkPath() {
    return this.props.hasAddon ? '/experiments' : '/';
  }

  showSettingsMenu() {
    return this.state.showSettings;
  }

  close() {
    if (!this.state.showSettings) { return; }
    this.closeTimer = setTimeout(() =>
      this.setState({ showSettings: false }), 10);
  }

  renderHeaderMenu() {
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

  blogLinkClick() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'click',
      eventLabel: 'open blog'
    });
  }

  render() {
    return (
      <div>
        {this.renderRetireDialog()}
        <header id="main-header">
          <LayoutWrapper flexModifier="row-between-breaking">
            <h1>
              <Localized id="siteName">
                <a href={ this.setHeaderLinkPath() } className="wordmark">Firefox Test Pilot</a>
              </Localized>
            </h1>
              <div className="header-links">
                <Localized id="headerLinkBlog">
                  <a className="blog-link" onClick={this.blogLinkClick.bind(this)} href="https://medium.com/firefox-test-pilot" target="_blank" rel="noopener noreferrer">Blog</a>
                </Localized>
                {this.renderHeaderMenu()}
              </div>
          </LayoutWrapper>
        </header>
      </div>
    );
  }

  toggleSettings() {
    if (this.state.showSettings) {
      this.close();
    } else {
      this.setState({ showSettings: true });
    }
  }

  retire() {
    this.setState({ showRetireDialog: true });
  }
}
