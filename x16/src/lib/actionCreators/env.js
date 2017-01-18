/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import aboutConfig from 'sdk/preferences/service';
import { CHANGE_ENV } from '../actions';
import environments from '../environments';
import { PrefsTarget } from 'sdk/preferences/event-target';
import self from 'sdk/self';

import type { Dispatch, ReduxStore } from 'testpilot/types';
export type Environment = { baseUrl: string, name: string, whitelist: string };
export type Env = { get(): Environment, subscribe(store: ReduxStore): void };

let dispatch: Dispatch = () => console.error('env.dispatch is not set');

const env = {
  get() {
    const name = aboutConfig.get('testpilot.env', 'production');
    const ev = typeof name === 'string'
      ? environments[name]
      : environments['production'];
    return ev || environments['production'];
  },
  subscribe(store: ReduxStore) {
    dispatch = store.dispatch;
  }
};

if (!aboutConfig.has('testpilot.env')) {
  // default to production
  aboutConfig.set('testpilot.env', 'production');
}

if (aboutConfig.get('testpilot.env') !== 'production') {
  // enable debug level logging
  aboutConfig.set(`extensions.${self.id}.sdk.console.logLevel`, 'debug');
}

const prefs = new PrefsTarget();
prefs.on('testpilot.env', () => {
  dispatch(CHANGE_ENV());
});

export default env;
