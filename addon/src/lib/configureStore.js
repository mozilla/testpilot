/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import reducers from './reducers';
import { storage } from 'sdk/simple-storage';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import type Hub from './middleware/Hub';
import type { Environment } from './actionCreators/env';
import type { ReduxStore, AddonState } from 'testpilot/types';

const initialState = (Object.assign({}, storage.root): AddonState);

export default function configureStore(
  { hub, startEnv }: { hub: Hub, startEnv: Environment }
) {
  if (!initialState.baseUrl) {
    initialState.baseUrl = startEnv.baseUrl;
  }
  const middleware = [ hub.middleware() ];
  if (startEnv.name !== 'production') {
    middleware.push(createLogger({ colors: false }));
  }
  return (createStore(
    reducers,
    initialState,
    applyMiddleware(...middleware)
  ): ReduxStore);
}
