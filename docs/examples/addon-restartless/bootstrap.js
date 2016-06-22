/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
let console = Cu.import('resource://gre/modules/Console.jsm').console;
let {setTimeout} = Cu.import('resource://gre/modules/Timer.jsm', {});

XPCOMUtils.defineLazyModuleGetter(this, 'Services',
  'resource://gre/modules/Services.jsm');
XPCOMUtils.defineLazyModuleGetter(this, 'registerVariants',
  'chrome://restartless-experiment/content/variants.js');


const addonId = 'restartless-experiment@mozilla.com';
let variants;

// Define your tests...
const variantTests = {
  someFeature: {
    name: 'Some Feature',
    description: 'An example A/B test.',
    variants: [
      { description: 'A', value: 'A', weight: 1 },
      { description: 'B', value: 'B', weight: 1 }
    ]
  }
};

// Then, on startup, ask Test Pilot what to do.
function startup(data, reason) {
  registerVariants(addonId, variantTests).then(payload => {

    // When Test Pilot responds, finish initialization with the payload:
    variants = JSON.parse(payload.data);
    console.log('Variants received', variants);

    // Future metrics pings will include that data.
    setTimeout(() => {
      sendMetric({
        hello: 'world'
      });
    }, 3000);
  });
}

function shutdown(data, reason) {
  Cu.unload('chrome://restartless-experiment/content/variants.js');
}

function install(data, reason) {}

function uninstall(data, reason) {}


// Metrics utilities

const observerService = Cc["@mozilla.org/observer-service;1"]
                        .getService(Ci.nsIObserverService);

function makeSubject(addonId) {
  return {
    wrappedJSObject: {
      observersModuleSubjectWrapper: true,
      object: addonId
    }
  };
}

function sendMetric(payload) {
  const subject = makeSubject(addonId);
  const topic = 'testpilot::send-metric';
  observerService.notifyObservers(subject, topic, JSON.stringify(payload));
}
