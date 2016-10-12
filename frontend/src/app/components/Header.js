import React from 'react';
import { Link } from 'react-router';

import classnames from 'classnames';

import RetireConfirmationDialog from './RetireConfirmationDialog';
import DiscussDialog from './DiscussDialog';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.closeTimer = null;
    this.close = this.close.bind(this);
    this.dismissRetireDialog = this.dismissRetireDialog.bind(this);
    this.dismissDiscussDialog = this.dismissDiscussDialog.bind(this);
    this.state = {
      showDiscussDialog: false,
      showRetireDialog: false
    };
  }

  shouldRenderSettingsMenu() {
    return this.props.hasAddon;
  }

  showSettingsMenu() {
    return this.state.showSettings;
  }

  renderSettingsMenu() {
    if (this.shouldRenderSettingsMenu()) {
      return (
        <div data-hook="settings">
          <div className="settings-contain" data-hook="active-user">
             <div className={classnames(['button', 'outline', 'settings-button'], { active: this.showSettingsMenu() })}
                  onClick={e => this.toggleSettings(e)}
                  data-hook="settings-button" data-l10n-id="menuTitle">Settings</div>
               {this.showSettingsMenu() && <div className="settings-menu" onClick={e => this.settingsClick(e)}>
               <ul>
                 <li><a onClick={e => this.wiki(e)} data-l10n-id="menuWiki" data-hook="wiki"
                    href="https://wiki.mozilla.org/Test_Pilot" target="_blank">Test Pilot Wiki</a></li>
                 <li><a onClick={e => this.discuss(e)} data-l10n-id="menuDiscuss" data-hook="discuss"
                    href="https://discourse.mozilla-community.org/c/test-pilot" target="_blank">Discuss Test Pilot</a></li>
                 <li><a onClick={e => this.fileIssue(e)} data-l10n-id="menuFileIssue" data-hook="issue"
                    href="https://github.com/mozilla/testpilot/issues/new" target="_blank">File an Issue</a></li>
                 <li><hr /></li>
                 <li><a onClick={e => this.retire(e)} data-l10n-id="menuRetire" data-hook="retire">Uninstall Test Pilot</a></li>
               </ul>
             </div>}
          </div>
        </div>
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
          onDismiss={this.dismissRetireDialog}
          {...this.props}
        />
      );
    }
    return null;
  }

  dismissDiscussDialog() {
    this.setState({
      showDiscussDialog: false
    });
  }

  renderDiscussDialog() {
    if (this.state.showDiscussDialog) {
      return (
        <DiscussDialog {...this.props}
          href="https://discourse.mozilla-community.org/c/test-pilot"
          openWindow={this.props.openWindow}
          onDismiss={this.dismissDiscussDialog}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderRetireDialog()}
        {this.renderDiscussDialog()}
        <header id="main-header" className="responsive-content-wrapper">
          <h1>
            <Link to="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</Link>
          </h1>
          {this.renderSettingsMenu()}
        </header>
      </div>
    );
  }

  // HACK: We want to close the settings menu on any click outside the menu.
  // However, a manually-attached event listener on document.body seems to fire
  // the 'close' event before any other clicks register inside the settings
  // menu. So, here's a kludge to schedule a menu close on any click, but
  // cancel if the click was inside the menu. Sounds backwards, but it works.

  componentDidMount() {
    document.body.addEventListener('click', this.close);
  }

  componentWillUnmount() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); }
    document.body.removeEventListener('click', this.close);
  }

  close() {
    if (!this.state.showSettings) { return; }
    this.closeTimer = setTimeout(() =>
      this.setState({ showSettings: false }), 10);
  }

  settingsClick() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); }
  }

  toggleSettings(ev) {
    ev.stopPropagation();
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Toggle Menu'
    });
    if (this.state.showSettings) {
      this.close(ev);
    } else {
      this.setState({ showSettings: true });
    }
  }

  retire(evt) {
    evt.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Retire'
    });
    this.setState({ showRetireDialog: true });
    this.close();
  }

  discuss(evt) {
    evt.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Discuss'
    });
    this.setState({ showDiscussDialog: true });
    this.close();
  }

  wiki() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'wiki'
    });
    this.close();
  }

  fileIssue() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'file issue'
    });
    this.close();
  }
}

Header.propTypes = {
  uninstallAddon: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired,
  openWindow: React.PropTypes.func.isRequired,
  hasAddon: React.PropTypes.bool,
  forceHideSettings: React.PropTypes.bool
};
