import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  template: `<div class="settings-contain">
               <div class="settings-button" data-hook="settings-button">
                 <span></span>
                 <span></span>
                 <span></span>
               </div>

               <div class="settings-menu hidden">
                 <div class="arrow-up"></div>
                 <ul>
                   <li><a data-hook="launch-tour">Tour Idea Town</a></li>
                   <li><a href="https://wiki.mozilla.org/Idea-Town">Idea Town Wiki</a></li>
                   <li><a href="https://github.com/mozilla/idea-town/issues/new">File an Issue</a></li>
                   <li><a data-hook="logout">Logout</a></li>
                 </ul>
               </div>
             </div>`,

  events: {
    'click [data-hook=logout]': 'logout',
    'click [data-hook=settings-button]': 'toggleSettings'
  },

  toggleSettings() {
    const setEl = this.query('.settings-menu');
    if (setEl.classList.contains('hidden')) {
      setEl.classList.remove('hidden');
    } else {
      setEl.classList.add('hidden');
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
