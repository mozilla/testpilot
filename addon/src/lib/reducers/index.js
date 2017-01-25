/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { reducer as baseUrl } from './baseUrl';
import { reducer as clientUUID } from './clientUUID';
import { reducer as env } from './env';
import { reducer as experiments } from './experiments';
import { reducer as notifications } from './notifications';
import { reducer as ratings } from './ratings';
import { reducer as sideEffects } from './sideEffects';
import { reducer as ui } from './ui';
import { combineReducers } from 'redux';

export default combineReducers({
  baseUrl,
  clientUUID,
  env,
  experiments,
  notifications,
  ratings,
  sideEffects,
  ui
});
