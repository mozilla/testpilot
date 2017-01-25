/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';

// eslint-disable-next-line
import type { Addon } from 'resource://gre/modules/AddonManager.jsm';
import type { Experiment } from '../Experiment';
import type { Dispatch, ReduxStore } from 'testpilot/types';

function getExperiment(getState, addon): ?Experiment {
  const { experiments } = getState();
  return experiments[addon.id];
}

export default class AddonListener {
  getExperiment: (addon: Addon) => ?Experiment;
  dispatch: Dispatch;

  constructor({ dispatch, getState }: ReduxStore) {
    this.getExperiment = getExperiment.bind(null, getState);
    this.dispatch = dispatch;
    AddonManager.addAddonListener(this);
  }

  onEnabled(addon: Addon) {
    const experiment = this.getExperiment(addon);
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_ENABLED({ experiment }));
    } else {
      this.dispatch(actions.ADDONS_CHANGED());
    }
  }

  onDisabled(addon: Addon) {
    const experiment = this.getExperiment(addon);
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_DISABLED({ experiment }));
    } else {
      this.dispatch(actions.ADDONS_CHANGED());
    }
  }

  onUninstalling(addon: Addon) {
    const experiment = this.getExperiment(addon);
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLING({ experiment }));
    } else {
      this.dispatch(actions.ADDONS_CHANGED());
    }
  }

  onUninstalled(addon: Addon) {
    const experiment = this.getExperiment(addon);
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLED({ experiment }));
    } else {
      this.dispatch(actions.ADDONS_CHANGED());
    }
  }

  onOperationCancelled(addon: Addon) {
    const experiment = this.getExperiment(addon);
    if (experiment) {
      if (addon.pendingOperations & AddonManager.PENDING_ENABLE) {
        this.dispatch(actions.EXPERIMENT_ENABLED({ experiment }));
      } else if (addon.userDisabled && addon.installDate) {
        this.dispatch(actions.EXPERIMENT_DISABLED({ experiment }));
      }
    } else {
      this.dispatch(actions.ADDONS_CHANGED());
    }
  }

  teardown() {
    AddonManager.removeAddonListener(this);
  }
}
