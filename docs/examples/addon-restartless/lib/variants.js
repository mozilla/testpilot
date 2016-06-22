/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const EXPORTED_SYMBOLS = ['registerVariants'];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import('resource://gre/modules/XPCOMUtils.jsm');

XPCOMUtils.defineLazyModuleGetter(this, 'clearInterval',
                                  'resource://gre/modules/Timer.jsm');
XPCOMUtils.defineLazyModuleGetter(this, 'setInterval',
                                  'resource://gre/modules/Timer.jsm');


function TestPilotObserver(topic, resolve) {
  this.topic = topic;
  this.resolve = resolve;
  this.register();
}

TestPilotObserver.prototype = {
  observe: function(subject, topic, data) {
    this.resolve({
      subject: subject,
      topic: topic,
      data: data
    });
    this.unregister();
  },

  register: function() {
    let observerService = Cc["@mozilla.org/observer-service;1"]
                          .getService(Ci.nsIObserverService);
    observerService.addObserver(this, this.topic, false);
  },

  unregister: function() {
    let observerService = Cc["@mozilla.org/observer-service;1"]
                          .getService(Ci.nsIObserverService);
    observerService.removeObserver(this, this.topic);
  }
};


function registerVariants(addonId, payload) {
  let observerService = Cc["@mozilla.org/observer-service;1"]
                        .getService(Ci.nsIObserverService);

  let receiveTopic = 'testpilot::receive-variants';
  let registerTopic = 'testpilot::register-variants';

  return new Promise((resolve, reject) => {
    let intervalPing = setInterval(() => {
      observerService.notifyObservers(
        {
          wrappedJSObject: {
            observersModuleSubjectWrapper: true,
            object: addonId
          }
        },
        registerTopic,
        JSON.stringify(payload)
      );
    }, 100);
    let observer = new TestPilotObserver(receiveTopic, data => {
      clearInterval(intervalPing);
      resolve(data);
    });
    observerService.addObserver(observer, receiveTopic, false);
  });
};
