/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { activeExperiments } from './lib/reducers/experiments';
import AddonListener from './lib/actionCreators/AddonListener';
import configureStore from './lib/configureStore';
import createExperimentMetrics from './lib/metrics';
import env from './lib/actionCreators/env';
import FeedbackManager from './lib/actionCreators/FeedbackManager';
import * as hacks from './lib/experimentHacks';
import Hub from './lib/middleware/Hub';
import InstallManager from './lib/actionCreators/InstallManager';
import Loader from './lib/actionCreators/Loader';
import MainUI from './lib/actionCreators/MainUI';
import NotificationManager from './lib/actionCreators/NotificationManager';
import self from 'sdk/self';
import { Services } from 'resource://gre/modules/Services.jsm';
import * as sideEffects from './lib/reducers/sideEffects';
import { storage } from 'sdk/simple-storage';
import tabs from 'sdk/tabs';
import Telemetry from './lib/Telemetry';
import WebApp from './lib/WebApp';

const startEnv = env.get();
const hub = new Hub();
const store = configureStore({ startEnv, hub });
const addons = new AddonListener(store);
const experimentMetrics = createExperimentMetrics(store.getState().clientUUID);
const feedbackManager = new FeedbackManager(store);
const installManager = new InstallManager(store);
const loader = new Loader(store);
const notificationManager = new NotificationManager(store);
const telemetry = new Telemetry(store);
const ui = new MainUI(store);
const webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  clientUUID: store.getState().clientUUID,
  hub
});

export function main({ loadReason }: { loadReason: string }) {
  sideEffects.setContext(
    Object.assign({}, store, {
      env,
      feedbackManager,
      hacks,
      installManager,
      loader,
      notificationManager,
      self,
      tabs,
      telemetry,
      ui,
      webapp
    })
  );
  env.subscribe(store);
  sideEffects.enable(store);
  loader.loadExperiments(startEnv.name, startEnv.baseUrl);
  notificationManager.schedule();
  feedbackManager.schedule();
  feedbackManager.maybeShare();
  if (loadReason === 'install' || loadReason === 'enable') {
    telemetry.setPrefs();
    telemetry.ping(self.id, 'enabled');
  }
  telemetry.sendGAEvent({
    t: 'event',
    ec: 'add-on Interactions',
    ea: 'browser startup',
    el: Object.keys(activeExperiments(store.getState())).length
  });
  Services.obs.addObserver(
    () => {
      telemetry.ping(
        Object.keys(activeExperiments(store.getState())).length.toString(),
        'daily'
      );
    },
    'idle-daily',
    false
  );
}

export function onUnload(reason: string) {
  switch (reason) {
    case 'uninstall':
      telemetry.ping(self.id, 'disabled');
      telemetry.restorePrefs();
      installManager.uninstallAll();
      break;
    case 'disable':
      telemetry.ping(self.id, 'disabled');
      telemetry.restorePrefs();
  }
  storage.root = store.getState();
  sideEffects.disable();
  addons.teardown();
  experimentMetrics.teardown();
  webapp.teardown();
}
