/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

self.port.on('show', content => {
  document.getElementById('content').innerHTML = content;
  const form = document.querySelector('form');
  if (form) {
    form.onsubmit = submitFeedback;
    document.querySelector('.back').addEventListener('click', () => {
      self.port.emit('back');
    });
  } else attachLinkCatch();
});

self.port.on('feedback', content => {
  document.getElementById('feedback').innerHTML = content;
});

function attachLinkCatch() {
  Array.from(document.querySelectorAll('a')).forEach(el => {
    el.onclick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.target.nodeName === 'BUTTON') return launchSurvey(ev);
      self.port.emit('link', el.href);
    };
  });
}

function launchSurvey(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  self.port.emit('launch-feedback', ev.target.getAttribute('data-addon-id'));
}

function submitFeedback(ev) {
  ev.stopPropagation();
  self.port.emit('feedback-submit', JSON.stringify({
    nps: ev.target.querySelector('input:checked').value,
    addon_id: ev.target.getAttribute('data-addon-id')
  }));
}
