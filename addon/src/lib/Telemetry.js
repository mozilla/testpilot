/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import aboutConfig from 'sdk/preferences/service';
import { Request } from 'sdk/request';
import self from 'sdk/self';
import { Services } from 'resource://gre/modules/Services.jsm';
import { storage } from 'sdk/simple-storage';
import {
  TelemetryController
} from 'resource://gre/modules/TelemetryController.jsm';

import type { ReduxStore } from 'testpilot/types';

const startTime = (Services.startup.getStartupInfo().process: Date);

function makeTimestamp(timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000);
}

const PREFS = [
  'toolkit.telemetry.enabled',
  'datareporting.healthreport.uploadEnabled'
];

export default class Telemetry {
  store: ReduxStore;
  constructor(store: ReduxStore) {
    this.store = store;
  }

  setPrefs() {
    storage.originalPrefs = PREFS.map(pref => [ pref, aboutConfig.get(pref) ]);
    PREFS.forEach(pref => aboutConfig.set(pref, true));
  }

  restorePrefs() {
    if (storage.originalPrefs) {
      storage.originalPrefs.forEach(pair => {
        aboutConfig.set(pair[0], pair[1]);
      });
    }
  }

  ping(object: any, event: string, time?: number) {
    const payload = {
      timestamp: makeTimestamp(),
      test: self.id,
      version: self.version,
      events: [ { timestamp: makeTimestamp(time), event, object } ]
    };
    TelemetryController.submitExternalPing('testpilot', payload, {
      addClientId: true,
      addEnvironment: true
    });

    this.sendGAEvent({
      t: 'event',
      ec: 'add-on Interactions',
      ea: object,
      el: event
    });
  }

  sendGAEvent(data: Object) {
    const { clientUUID } = this.store.getState();
    data.v = 1;
    // Version -- https://developers.google.com/analytics/devguides/collection/protocol/v1/
    data.tid = 'UA-49796218-47';
    data.cid = clientUUID;
    const req = new Request({
      url: 'https://ssl.google-analytics.com/collect',
      content: data
    });
    req.post();
  }
}
