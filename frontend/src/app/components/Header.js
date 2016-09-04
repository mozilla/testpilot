import React from 'react';
import { Link } from 'react-router';

import classnames from 'classnames';

// import { sendMessage } from '../lib/addon';
import { sendToGA } from '../lib/utils';

import RetireConfirmationDialog from './RetireConfirmationDialog';
import DiscussDialog from './DiscussDialog';

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      showSettings: false,
      showDiscussDialog: false,
      showRetireDialog: false
    };
  }

  render() {
    const { showSettings, showRetireDialog, showDiscussDialog } = this.state;

    return (
      <header id="main-header" className="responsive-content-wrapper">

        {showRetireDialog &&
          <RetireConfirmationDialog onDismiss={() => this.setState({ showRetireDialog: false })} />}

        {showDiscussDialog &&
          <DiscussDialog
            href="https://discourse.mozilla-community.org/c/test-pilot"
            onDismiss={() => this.setState({ showDiscussDialog: false })} />}

        <h1>
          <Link to="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</Link>
        </h1>
        <div data-hook="settings">
          <div className="settings-contain" data-hook="active-user">
             <div className={classnames(['button', 'outline', 'settings-button'], { active: showSettings })}
                  onClick={e => this.toggleSettings(e)}
                  data-hook="settings-button" data-l10n-id="menuTitle">Settings</div>
             {showSettings && <div className="settings-menu">
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
      </header>
    );
  }

  componentDidMount() {
    this.closeHandler = this.close.bind(this);
    document.body.addEventListener('click', this.closeHandler);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closeHandler);
  }

  close() {
    this.setState({ showSettings: false });
  }

  toggleSettings(ev) {
    ev.stopPropagation();
    sendToGA('event', {
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
    console.log('RETIRE LINK');
    evt.preventDefault();
    sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Retire'
    });
    this.setState({ showRetireDialog: true });
  }

  discuss(evt) {
    evt.preventDefault();
    sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Discuss'
    });
    this.setState({ showDiscussDialog: true });
  }

  wiki() {
    sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'wiki'
    });
  }

  fileIssue() {
    sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'file issue'
    });
  }

}
