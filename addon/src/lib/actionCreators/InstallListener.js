/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';

import type { Experiment } from '../Experiment';
import type { Dispatch } from 'testpilot/types';
import type {
  Addon,
  AddonInstall
} from 'resource://gre/modules/AddonManager.jsm';

function toObject(install: AddonInstall, experiment: Experiment) {
  // install properties aren't enumerable
  return {
    addon_id: experiment.addon_id,
    type: install.type,
    state: install.state,
    error: install.error,
    progress: install.progress,
    maxProgress: install.maxProgress
  };
}

export default class InstallListener {
  dispatch: Dispatch;
  experiment: Experiment;
  constructor(
    { experiment, dispatch }: { experiment: Experiment, dispatch: Dispatch }
  ) {
    this.dispatch = dispatch;
    this.experiment = experiment;
  }

  onInstallEnded(addonInstall: AddonInstall, addon: Addon) {
    this.dispatch(
      actions.INSTALL_ENDED({
        experiment: { addon_id: addon.id, installDate: addon.installDate }
      })
    );
  }

  onInstallFailed(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.INSTALL_FAILED({ install }));
  }

  onInstallStarted(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.INSTALL_STARTED({ install }));
  }

  onInstallCancelled(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.INSTALL_CANCELLED({ install }));
  }

  onDownloadStarted(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.DOWNLOAD_STARTED({ install }));
  }

  onDownloadProgress(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.DOWNLOAD_PROGRESS({ install }));
  }

  onDownloadEnded(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.DOWNLOAD_ENDED({ install }));
  }

  onDownloadCancelled(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.DOWNLOAD_CANCELLED({ install }));
  }

  onDownloadFailed(addonInstall: AddonInstall) {
    const install = toObject(addonInstall, this.experiment);
    this.dispatch(actions.DOWNLOAD_FAILED({ install }));
  }
}
