/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import { activeExperiments } from '../reducers/experiments';
import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';
import InstallListener from './InstallListener';
import self from 'sdk/self';

import type { Experiment } from '../Experiment';
import type { ReduxStore } from 'testpilot/types';

export default class InstallManager {
  store: ReduxStore;
  constructor(store: ReduxStore) {
    this.store = store;
  }

  uninstallExperiment(x: Experiment) {
    AddonManager.getAddonByID(x.addon_id, a => {
      if (a) {
        a.uninstall();
      }
    });
  }

  installExperiment(experiment: Experiment) {
    AddonManager.getInstallForURL(
      experiment.xpi_url,
      install => {
        const { dispatch } = this.store;
        install.addListener(new InstallListener({
          install,
          experiment,
          dispatch
        }));
        install.install();
      },
      'application/x-xpinstall'
    );
  }

  uninstallAll() {
    const { getState } = this.store;
    const active = activeExperiments(getState());
    // eslint-disable-next-line prefer-const
    for (let id of Object.keys(active)) {
      this.uninstallExperiment(active[id]);
    }
  }

  uninstallSelf() {
    AddonManager.getAddonByID(self.id, a => a.uninstall());
  }

  selfLoaded(reason: string) {
    const { dispatch } = this.store;
    if (reason === 'install') {
      dispatch(actions.SELF_INSTALLED());
    } else if (reason === 'enable') {
      dispatch(actions.SELF_ENABLED());
    }
  }

  selfUnloaded(reason: string) {
    const { dispatch } = this.store;
    if (reason === 'disable') {
      dispatch(actions.SELF_DISABLED());
    } else if (reason === 'uninstall') {
      dispatch(actions.SELF_UNINSTALLED());
    }
  }

  syncInstalled() {
    const { dispatch, getState } = this.store;
    AddonManager.getAllAddons(addons => {
      const activeAddonIds = addons
        .filter(a => a.isActive && !a.appDisabled && !a.userDisabled)
        .map(a => a.id);
      dispatch(
        actions.SYNC_INSTALLED({
          clientUUID: getState().clientUUID,
          installed: activeExperiments(getState()),
          active: activeAddonIds
        })
      );
    });
  }
}
