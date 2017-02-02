import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import LayoutWrapper from './LayoutWrapper';
import RetireConfirmationDialog from './RetireConfirmationDialog';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.closeTimer = null;
    this.close = this.close.bind(this);
    this.dismissRetireDialog = this.dismissRetireDialog.bind(this);
    this.state = {
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
        <div id="settings">
          <div className="settings-contain">
             <div className={classnames(['button', 'outline', 'settings-button'], { active: this.showSettingsMenu() })}
                  onClick={e => this.toggleSettings(e)}
                  data-l10n-id="menuTitle">Settings</div>
               {this.showSettingsMenu() && <div className="settings-menu" onClick={e => this.settingsClick(e)}>
               <ul>
                 <li><a onClick={e => this.wiki(e)} data-l10n-id="menuWiki"
                    href="https://wiki.mozilla.org/Test_Pilot" target="_blank">Test Pilot Wiki</a></li>
                 <li><a onClick={() => this.discuss()} data-l10n-id="menuDiscuss"
                    href="https://discourse.mozilla-community.org/c/test-pilot" target="_blank">Discuss Test Pilot</a></li>
                 <li><a onClick={e => this.fileIssue(e)} data-l10n-id="menuFileIssue"
                    href="https://github.com/mozilla/testpilot/issues/new" target="_blank">File an Issue</a></li>
                 <li><hr /></li>
                 <li><a onClick={e => this.retire(e)} data-l10n-id="menuRetire">Uninstall Test Pilot</a></li>
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

  render() {
    return (
      <div>
        {this.renderRetireDialog()}
        <header id="main-header">
          <LayoutWrapper flexModifier="row-between-top">
            <h1>
              <Link to="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</Link>
            </h1>
            {this.renderSettingsMenu()}
          </LayoutWrapper>
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

  discuss() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Discuss'
    });
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
