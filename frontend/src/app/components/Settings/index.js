// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import "./index.scss";

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
    this.props.sendToGA("event", {
      eventCategory: "Menu Interactions",
      eventAction: "drop-down menu",
      eventLabel: "wiki"
    });
    this.props.close();
  }

  fileIssue() {
    this.props.sendToGA("event", {
      eventCategory: "Menu Interactions",
      eventAction: "drop-down menu",
      eventLabel: "file issue"
    });
    this.props.close();
  }

  discuss() {
    this.props.sendToGA("event", {
      eventCategory: "Menu Interactions",
      eventAction: "drop-down menu",
      eventLabel: "Discuss"
    });
    this.props.close();
  }

  retire(evt: Object) {
    evt.preventDefault();
    this.props.sendToGA("event", {
      eventCategory: "Menu Interactions",
      eventAction: "drop-down menu",
      eventLabel: "Retire"
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
    sendToGA("event", {
      eventCategory: "Menu Interactions",
      eventAction: "drop-down menu",
      eventLabel: "Toggle Menu"
    });
    toggleSettings(evt);
  }

  render() {
    return (
      <div id="settings">
        <div className="settings-contain">
          <Localized id="menuTitle">
            <div className={classnames("settings-button", { active: this.showSettingsMenu() })}
              onClick={e => this.toggleSettings(e)}>
              Settings
            </div>
          </Localized>
          {
            this.showSettingsMenu()
            &&
            <div className="settings-menu" onClick={() => this.settingsClick()}>
              <ul>
                <li>
                  <Localized id="menuWiki">
                    <a onClick={() => this.wiki()}
                      href="https://wiki.mozilla.org/Test_Pilot"
                      target="_blank" rel="noopener noreferrer">
                      Test Pilot Wiki
                    </a>
                  </Localized>
                </li>
                <li>
                  <Localized id="menuDiscuss">
                    <a onClick={() => this.discuss()}
                      href="https://discourse.mozilla-community.org/c/test-pilot"
                      target="_blank" rel="noopener noreferrer">Discuss Test Pilot</a>
                  </Localized>
                </li>
                <li>
                  <Localized id="menuFileIssue">
                    <a onClick={() => this.fileIssue()}
                      href="https://github.com/mozilla/testpilot/issues/new"
                      target="_blank" rel="noopener noreferrer">File an Issue</a>
                  </Localized>
                </li>
                <li><hr /></li>
                <li>
                  <Localized id="menuRetire">
                    <a onClick={e => this.retire(e)}>Uninstall Test Pilot</a>
                  </Localized>
                </li>
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
    if (typeof document !== "undefined"
      && document.body !== null) {
      document.body.addEventListener("click", this.props.close);
    }
  }

  componentWillUnmount() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); }
    if (typeof document !== "undefined"
      && document.body !== null) {
      document.body.removeEventListener("click", this.props.close);
    }
  }

}
