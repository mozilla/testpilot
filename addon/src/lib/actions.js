/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import type { Action, ActionMeta } from 'testpilot/types';

export type ActionCreator = {
  (payload: ?Object, meta?: ActionMeta): Action,
  type: string,
  args: string[]
};

function argsOk(actual: Object, expected: string[]) {
  return Object.keys(actual).every(key => expected.includes(key)) &&
    expected.every(key => actual.hasOwnProperty(key));
}

function createAction(type: string, payloadArgs: string[]): ActionCreator {
  function action(payload: ?Object, meta?: ActionMeta = {}) {
    payload = payload || {};
    if (!argsOk(payload, payloadArgs)) {
      throw new Error(
        `Action ${type} expected [${payloadArgs.join(
          ','
        )}] but got [${Object.keys(payload).join(',')}]`
      );
    }
    return { type, meta, payload };
  }
  action.type = type;
  action.args = payloadArgs;
  return action;
}

// addon created
export const ADDONS_CHANGED = createAction('ADDONS_CHANGED', []);
export const INSTALL_ENDED = createAction('INSTALL_ENDED', [ 'experiment' ]);
export const INSTALL_FAILED = createAction('INSTALL_FAILED', [ 'install' ]);
export const INSTALL_STARTED = createAction('INSTALL_STARTED', [ 'install' ]);
export const INSTALL_CANCELLED = createAction('INSTALL_CANCELLED', [
  'install'
]);
export const DOWNLOAD_STARTED = createAction('DOWNLOAD_STARTED', [ 'install' ]);
export const DOWNLOAD_PROGRESS = createAction('DOWNLOAD_PROGRESS', [
  'install'
]);
export const DOWNLOAD_ENDED = createAction('DOWNLOAD_ENDED', [ 'install' ]);
export const DOWNLOAD_CANCELLED = createAction('DOWNLOAD_CANCELLED', [
  'install'
]);
export const DOWNLOAD_FAILED = createAction('DOWNLOAD_FAILED', [ 'install' ]);
export const LOAD_EXPERIMENTS = createAction('LOAD_EXPERIMENTS', [
  'envname',
  'baseUrl'
]);
export const LOADING_EXPERIMENTS = createAction('LOADING_EXPERIMENTS', [
  'envname'
]);
export const EXPERIMENTS_LOADED = createAction('EXPERIMENTS_LOADED', [
  'envname',
  'baseUrl',
  'experiments'
]);
export const EXPERIMENTS_LOAD_ERROR = createAction('EXPERIMENTS_LOAD_ERROR', [
  'err'
]);
export const EXPERIMENT_ENABLED = createAction('EXPERIMENT_ENABLED', [
  'experiment'
]);
export const EXPERIMENT_DISABLED = createAction('EXPERIMENT_DISABLED', [
  'experiment'
]);
export const EXPERIMENT_UNINSTALLING = createAction('EXPERIMENT_UNINSTALLING', [
  'experiment'
]);
export const EXPERIMENT_UNINSTALLED = createAction('EXPERIMENT_UNINSTALLED', [
  'experiment'
]);
export const CHANGE_ENV = createAction('CHANGE_ENV', []);
export const SET_BADGE = createAction('SET_BADGE', [ 'text' ]);
export const MAIN_BUTTON_CLICKED = createAction('MAIN_BUTTON_CLICKED', [
  'time'
]);
export const MAYBE_NOTIFY = createAction('MAYBE_NOTIFY', [ 'experiment' ]);
export const SHOW_NOTIFICATION = createAction('SHOW_NOTIFICATION', [
  'id',
  'title',
  'text',
  'url'
]);
export const SCHEDULE_NOTIFIER = createAction('SCHEDULE_NOTIFIER', [
  'nextCheck',
  'lastNotified'
]);
export const SELF_INSTALLED = createAction('SELF_INSTALLED', []);
export const SELF_UNINSTALLED = createAction('SELF_UNINSTALLED', []);
export const SELF_ENABLED = createAction('SELF_ENABLED', []);
export const SELF_DISABLED = createAction('SELF_DISABLED', []);
export const SET_RATING = createAction('SET_RATING', [
  'experiment',
  'rating',
  'time'
]);
export const SHOW_RATING_PROMPT = createAction('SHOW_RATING_PROMPT', [
  'interval',
  'experiment'
]);
export const SYNC_INSTALLED = createAction('SYNC_INSTALLED', [
  'clientUUID',
  'installed',
  'active'
]);
export const PROMPT_SHARE = createAction('PROMPT_SHARE', [ 'url' ]);

// webapp created
export const INSTALL_EXPERIMENT = createAction('INSTALL_EXPERIMENT', [
  'experiment'
]);
export const UNINSTALL_EXPERIMENT = createAction('UNINSTALL_EXPERIMENT', [
  'experiment'
]);
export const UNINSTALL_SELF = createAction('UNINSTALL_SELF', []);
export const GET_INSTALLED = createAction('GET_INSTALLED', []);
export const SET_BASE_URL = createAction('SET_BASE_URL', [ 'url' ]);
export const BROWSER_STARTUP = createAction('BROWSER_STARTUP', []);
