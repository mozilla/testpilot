/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global cloneInto self CustomEvent */

// New channel
self.port.on('action', function(data) {
  const clonedData = cloneInto(data, document.defaultView);
  document.documentElement.dispatchEvent(
    new CustomEvent('addon-action', {
      bubbles: true,
      detail: clonedData
    })
  );
});

function onAction(event) {
  self.port.emit('action', event.detail);
}

window.addEventListener('action', onAction, false);

// Legacy channel
self.port.on('from-addon-to-web', function(data) {
  const clonedData = cloneInto(data, document.defaultView);
  document.documentElement.dispatchEvent(
    new CustomEvent('from-addon-to-web', {
      bubbles: true,
      detail: clonedData
    })
  );
});

function onWebToAddon(event) {
  self.port.emit('from-web-to-addon', event.detail);
}

window.addEventListener('from-web-to-addon', onWebToAddon, false);

/*
  Emit a ping event every second to tell the webapp that the addon
  is still alive. The webapp can use the abscence of these pings
  to detect when the addon gets disabled or uninstalled.
*/
setInterval(
  function() {
    const detail = cloneInto({ type: 'ping' }, document.defaultView);
    document.documentElement.dispatchEvent(
      new CustomEvent('from-addon-to-web', { bubbles: true, detail })
    );
  },
  1000
);
