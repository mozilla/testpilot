import app from 'ampersand-app';

import BaseView from './base-view';
import RetireDialogView from './retire-dialog-view';

export default BaseView.extend({
  template: `<div class="settings-contain">
               <div class="settings-button" data-hook="settings-button">
                 <span></span>
                 <span></span>
                 <span></span>
               </div>

               <div class="settings-menu no-display">
                 <ul>
                   <li><a data-l10n-id="menuWiki" data-hook="wiki" href="https://wiki.mozilla.org/Test_Pilot" target="_blank">Test Pilot Wiki</a></li>
                   <li><a data-l10n-id="menuFileIssue" data-hook="issue" href="https://github.com/mozilla/testpilot/issues/new" target="_blank">File an Issue</a></li>
                   <li><a data-l10n-id="menuLogout" data-hook="logout">Logout</a></li>
                   <li><hr></li>
                   <li><a data-l10n-id="menuRetire" data-hook="retire">Retire</a></li>
                 </ul>
               </div>
             </div>`,

  events: {
    'click [data-hook=logout]': 'logout',
    'click [data-hook=wiki]': 'wiki',
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
    if (setEl.classList.contains('no-display')) {
      setEl.classList.remove('no-display');
      this.query('.settings-button').classList.add('active');
    } else {
      this.close();
    }
  },

  logout() {
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'Logout'
    });
    fetch('/accounts/logout/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRFTOKEN': app.me.csrfToken }
    }).then(() => {
      window.location.reload();
    }).catch((err) => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  },

  retire(evt) {
    evt.preventDefault();
    this.renderSubview(new RetireDialogView({
      id: 'retire-dialog',
      onSubmit: () => {
        app.trigger('router:new-page', {page: 'retire'});
      }
    }), 'body');
  },

  wiki(ev) {
    ev.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'wiki',
      newTab: true,
      outboundURL: ev.target.getAttribute('href')
    });
  },

  fileIssue(ev) {
    ev.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: 'file issue',
      newTab: true,
      outboundURL: ev.target.getAttribute('href')
    });
  }
});
