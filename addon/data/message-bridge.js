/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global cloneInto unsafeWindow */

// Page script acts as messaging bridge between addon and web content.

window.addEventListener('from-web-to-addon', function(event) {
  self.port.emit('from-web-to-addon', event.detail);
}, false);

self.port.on('from-addon-to-web', function(data) {
  const clonedData = cloneInto(data, document.defaultView);
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-addon-to-web', { bubbles: true, detail: clonedData }
  ));
});

/*
  Emit a ping event every second to tell the webapp that the addon
  is still alive. The webapp can use the abscence of these pings
  to detect when the addon gets disabled or uninstalled.
*/
setInterval(function() {
  const detail = cloneInto({ type: 'ping' }, document.defaultView);
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-addon-to-web', { bubbles: true, detail }
  ));
}, 1000);
