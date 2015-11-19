import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  template: `<div class="settings-contain">
               <div class="settings-button" data-hook="settings-button">
                 <span></span>
                 <span></span>
                 <span></span>
               </div>

               <div class="settings-menu no-display">
                 <ul>
                   <li><a data-hook="launch-tour">Tour Idea Town</a></li>
                   <li><a href="https://wiki.mozilla.org/Idea-Town" target="_blank">Idea Town Wiki</a></li>
                   <li><a href="https://github.com/mozilla/idea-town/issues/new" target="_blank">File an Issue</a></li>
                   <li><a data-hook="logout">Logout</a></li>
                 </ul>
               </div>
             </div>`,

  events: {
    'click [data-hook=logout]': 'logout',
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
    const setEl = this.query('.settings-menu');
    if (setEl.classList.contains('no-display')) {
      setEl.classList.remove('no-display');
      this.query('.settings-button').classList.add('active');
    } else {
      this.close();
    }
  },

  logout() {
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
  }
});
