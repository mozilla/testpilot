import app from 'ampersand-app';

import BaseView from './base-view';
import RetireDialogView from './retire-dialog-view';
import DiscussNotifyView from './discuss-notification-view';

export default BaseView.extend({
  template: `<div class="settings-contain">
               <div class="button outline settings-button" data-hook="settings-button" data-l10n-id="menuTitle">Settings</div>
               <div class="settings-menu no-display">
                 <ul>
                   <li><a data-l10n-id="menuWiki" data-hook="wiki" href="https://wiki.mozilla.org/Test_Pilot" target="_blank">Test Pilot Wiki</a></li>
                   <li><a data-l10n-id="menuDiscuss" data-hook="discuss" href="https://discourse.mozilla-community.org/c/test-pilot" target="_blank">Discuss Test Pilot</a></li>
                   <li><a data-l10n-id="menuFileIssue" data-hook="issue" href="https://github.com/mozilla/testpilot/issues/new" target="_blank">File an Issue</a></li>
                   <li><hr></li>
                   <li><a data-l10n-id="menuRetire" data-hook="retire">Uninstall Test Pilot</a></li>
                 </ul>
               </div>
             </div>`,

  events: {
    'click [data-hook=wiki]': 'wiki',
    'click [data-hook=discuss]': 'discuss',
    'click [data-hook=issue]': 'fileIssue',
    'click [data-hook=retire]': 'retire',
    'click [data-hook=settings-button]': 'toggleSettings'
  },

  afterRender() {
    document.body.addEventListener('click', this.close.bind(this));
  },

  close(ev) {
    if (!ev.target.parentElement.classList.contains('settings-menu')) {
      this.query('.settings-menu').classList.add('no-display');
      this.query('.settings-button').classList.remove('active');
    }
  },

  toggleSettings(ev) {
    ev.stopPropagation();
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Toggle Menu'
    });
    const setEl = this.query('.settings-menu');
    const buttonEl = this.query('.settings-button');
    if (setEl.classList.contains('no-display')) {
      setEl.classList.remove('no-display');
      buttonEl.classList.add('active');
    } else {
      this.close(ev);
    }
  },

  retire(evt) {
    evt.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Retire'
    });
    this.renderSubview(new RetireDialogView({
      id: 'retire-dialog',
      onSubmit: () => {
        app.trigger('router:new-page', {page: 'retire'});
      }
    }), 'body');
  },

  discuss(evt) {
    evt.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Discuss'
    });

    this.renderSubview(new DiscussNotifyView({
      id: 'discuss-dialog',
      onSubmit: () => {
        window.location = evt.target.getAttribute('href');
      }
    }), 'body');
  },

  wiki() {
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'wiki'
    });
  },

  fileIssue() {
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'file issue'
    });
  }
});
