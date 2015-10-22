/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global cloneInto unsafeWindow */

// Page script acts as messaging bridge between addon and web content.

// Let the client know that the addon is installed.
unsafeWindow.navigator.ideatownAddon = true;

window.addEventListener('from-web-to-addon', function(event) {
  self.port.emit('from-web-to-addon', event.detail);
}, false);

self.port.on('from-addon-to-web', function(data) {
  const clonedData = cloneInto(data, document.defaultView);
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-addon-to-web', { bubbles: true, detail: clonedData }
  ));
});
