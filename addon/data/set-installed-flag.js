/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global cloneInto unsafeWindow */

// Allow friendly clients to know that Test Pilot is installed.

unsafeWindow.navigator.testpilotAddon = true;
unsafeWindow.navigator.testpilotAddonVersion = self.options.version;

self.port.on('detach', function() {
  delete unsafeWindow.navigator.testpilotAddon;
  delete unsafeWindow.navigator.testpilotAddonVersion;
});
