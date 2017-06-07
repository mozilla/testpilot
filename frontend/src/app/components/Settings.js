// @flow

import React from 'react';
import classnames from 'classnames';

type SettingsProps = {
  hasAddon: any,
  sendToGA: Function,
  close: Function,
  retire: Function,
  toggleSettings: Function,
  settingsClick: Function,
  showSettingsMenu: Function,
  showSettings?: Function
}

export default class Settings extends React.Component {
  props: SettingsProps

  wiki() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'wiki'
    });
    this.props.close();
  }

  fileIssue() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'file issue'
    });
    this.props.close();
  }

  discuss() {
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Discuss'
    });
    this.props.close();
  }

  retire(evt: Object) {
    evt.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Retire'
    });
    this.props.retire();
    this.props.close();
  }

  settingsClick() {
    return this.props.settingsClick();
  }

  showSettingsMenu() {
    return this.props.showSettingsMenu();
  }

  toggleSettings(evt: Object) {
    const { sendToGA, toggleSettings } = this.props;
    sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Toggle Menu'
    });
    toggleSettings(evt);
  }

  render() {
    return (
      <div id="settings">
         <div className="settings-contain">
            <div className={classnames(['button', 'outline', 'settings-button'], { active: this.showSettingsMenu() })}
                 onClick={e => this.toggleSettings(e)}
                 data-l10n-id="menuTitle">
              Settings
            </div>
              {
                this.showSettingsMenu()
                &&
                <div className="settings-menu" onClick={e => this.settingsClick(e)}>
                  <ul>
                    <li>
                      <a onClick={e => this.wiki(e)} data-l10n-id="menuWiki"
                       href="https://wiki.mozilla.org/Test_Pilot"
                       target="_blank" rel="noopener noreferrer">
                       Test Pilot Wiki
                      </a>
                    </li>
                    <li><a onClick={() => this.discuss()} data-l10n-id="menuDiscuss"
                       href="https://discourse.mozilla-community.org/c/test-pilot"
                       target="_blank" rel="noopener noreferrer">Discuss Test Pilot</a></li>
                    <li><a onClick={e => this.fileIssue(e)} data-l10n-id="menuFileIssue"
                       href="https://github.com/mozilla/testpilot/issues/new"
                       target="_blank" rel="noopener noreferrer">File an Issue</a></li>
                    <li><hr /></li>
                    <li><a onClick={e => this.retire(e)} data-l10n-id="menuRetire">Uninstall Test Pilot</a></li>
                  </ul>
                </div>
              }
         </div>
       </div>
    );
  }

  // HACK: We want to close the settings menu on any click outside the menu.
  // However, a manually-attached event listener on document.body seems to fire
  // the 'close' event before any other clicks register inside the settings
  // menu. So, here's a kludge to schedule a menu close on any click, but
  // cancel if the click was inside the menu. Sounds backwards, but it works.

  componentDidMount() {
    if (typeof document !== 'undefined'
      && document.body !== null) {
      document.body.addEventListener('click', this.props.close);
    }
  }

  componentWillUnmount() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); }
    if (typeof document !== 'undefined'
      && document.body !== null) {
      document.body.removeEventListener('click', this.props.close);
    }
  }

}
