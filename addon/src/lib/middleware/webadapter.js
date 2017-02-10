/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';

import type { Action } from 'testpilot/types';

export const NO_ACTION = { type: 'NO_ACTION', payload: {} };

export function webToAction(webevent: ?Object): Action {
  const { type, data } = webevent || {};

  const meta = { src: 'web' };
  switch (type) {
    case 'install-experiment':
      return actions.INSTALL_EXPERIMENT({ experiment: data }, meta);

    case 'uninstall-experiment':
      return actions.UNINSTALL_EXPERIMENT({ experiment: data }, meta);

    case 'uninstall-self':
      return actions.UNINSTALL_SELF({}, meta);

    case 'sync-installed':
      return actions.GET_INSTALLED({}, meta);

    case 'base-url':
      return actions.SET_BASE_URL({ url: data }, meta);
  }
  return NO_ACTION;
}

export function actionToWeb({ payload, type }: Action) {
  switch (type) {
    case actions.INSTALL_ENDED.type:
      return {
        type: 'addon-install:install-ended',
        data: { id: payload.experiment.addon_id }
      };
    case actions.EXPERIMENT_UNINSTALLED.type:
      return {
        type: 'addon-uninstall:uninstall-ended',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      };
    case actions.SYNC_INSTALLED.type:
      return {
        type: 'sync-installed-result',
        data: {
          clientUUID: payload.clientUUID,
          installed: payload.installed,
          active: payload.active
        }
      };
    case actions.EXPERIMENT_ENABLED.type:
      return {
        type: 'addon-manage:enabled',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      };
    case actions.EXPERIMENT_DISABLED.type:
      return {
        type: 'addon-manage:disabled',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      };
  }
  return NO_ACTION;
}
