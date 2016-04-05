/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

self.port.on('show', content => {
  document.getElementById('content').innerHTML = content;
  Array.from(document.querySelectorAll('a')).forEach(el => {
    el.onclick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      self.port.emit('link', el.href);
    };
  });
});
