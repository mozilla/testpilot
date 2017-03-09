/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';
import { Experiment } from '../Experiment';
import { get as _ } from 'sdk/l10n';
import { Request } from 'sdk/request';
import { setTimeout, clearTimeout } from 'sdk/timers';
import WebExtensionChannels from '../metrics/webextension-channels';

// eslint-disable-next-line
import type { Experiments } from '../Experiment';
import type { ReduxStore } from 'testpilot/types';

const SIX_HOURS = 6 * 60 * 60 * 1000;

function fetchExperiments(baseUrl, path): Promise<Experiments> {
  return new Promise((resolve, reject) => {
    const r = new Request({
      headers: { Accept: 'application/json' },
      url: baseUrl + path
    });
    r.on('complete', (
      res: { status: number, json: { results: Array<Object> } }
    ) => {
      const xs = {};
      if (res.status === 200) {
        // eslint-disable-next-line prefer-const
        for (let o of res.json.results) {
          const x = new Experiment(o, baseUrl);
          xs[x.addon_id] = x;
        }
        resolve(xs);
      } else {
        reject(res);
      }
    });
    r.get();
  });
}

function mergeAddonState(experiments: Experiments, addons) {
  // eslint-disable-next-line prefer-const
  for (let id of Object.keys(experiments)) {
    experiments[id].active = false;
  }

  // eslint-disable-next-line prefer-const
  for (let addon of addons) {
    const x = experiments[addon.id];
    if (x) {
      x.active = true;
      x.manuallyDisabled = !addon.isActive;
      x.installDate = addon.installDate;
    }
  }
  return experiments;
}

export default class Loader {
  store: ReduxStore;
  timeout: ?number;
  constructor(store: ReduxStore) {
    this.store = store;
    this.timeout = null;
  }

  schedule(interval?: number = SIX_HOURS) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        const { env, baseUrl } = this.store.getState();
        this.loadExperiments(env, baseUrl);
      },
      interval
    );
  }

  loadExperiments(envname: string, baseUrl: string) {
    const { dispatch, getState } = this.store;
    return fetchExperiments(baseUrl, '/api/experiments.json')
      .then(
        xs => new Promise(resolve => {
          AddonManager.getAllAddons(addons => {
            resolve(mergeAddonState(xs, addons));
          });
        })
      )
      .then(xs => {
        const { ui: { clicked } } = getState();
        // eslint-disable-next-line prefer-const
        for (let id of Object.keys(xs)) {
          const experiment = xs[id];
          const launch = experiment.launchDate.getTime();
          if (launch > clicked && launch <= Date.now()) {
            dispatch(actions.SET_BADGE({ text: _('new_badge') }));
          }
          if (experiment.active && !experiment.manuallyDisabled) {
            WebExtensionChannels.add(experiment.addon_id);
          }
          dispatch(actions.MAYBE_NOTIFY({ experiment }));
        }
        return (xs: Experiments);
      })
      .then(
        experiments =>
          dispatch(
            actions.EXPERIMENTS_LOADED({ envname, baseUrl, experiments })
          ),
        (err: Object) => dispatch(actions.EXPERIMENTS_LOAD_ERROR({ err }))
      );
  }
}
