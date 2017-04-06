/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

declare module 'testpilot/types' {
  declare type Experiments = {
    [id: string]: Object
  }

  declare type AddonState = {
    baseUrl: string,
    clientUUID: string,
    env: string,
    experiments: Experiments,
    notifications: {
      lastNotified: number,
      nextCheck: number
    },
    ratings: {
      lastRated?: number,
      [id: string]: {
        rating: number,
        [interval: number | string]: boolean
      }
    },
    sideEffects: (context: Object) => void,
    ui: {
      installTimestamp: number,
      shareShown: boolean,
      badge: ?string,
      clicked: number
    }
  }

  declare type ActionMeta = {
    src?: string
  }

  declare type Action = {
    type: string,
    meta?: ActionMeta,
    payload: Object
  };

  declare type GetState = () => AddonState;
  declare type Dispatch = (action: Action) => void;
  declare type MiddlewareAPI = { dispatch: Dispatch, getState: GetState };
  declare type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => Dispatch;

  declare type ReduxStore = {
    dispatch: Dispatch,
    getState: GetState,
    subscribe: (listener: () => void) => (() => void)
  }
}
