/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { actionToWeb, webToAction, NO_ACTION } from './webadapter';
import type { Dispatch, Middleware } from 'testpilot/types';
import type { EventEmitter } from 'sdk/event/emitter';

export default class Hub {
  dispatch: Dispatch;
  ports: Set<EventEmitter>;
  constructor() {
    this.dispatch = () =>
      // eslint-disable-next-line no-console
      console.error('Hub cannot use dispatch() before middleware()');
    this.ports = new Set();
  }

  connect(port: EventEmitter): void {
    port.on('action', this.dispatch);
    port.on('from-web-to-addon', (evt: Object) =>
      this.dispatch(webToAction(evt)));
    this.ports.add(port);
  }

  disconnect(port: EventEmitter): void {
    port.off('action', this.dispatch);
    port.off('from-web-to-addon');
    this.ports.delete(port);
  }

  middleware(): Middleware {
    return ({ dispatch }) => {
      this.dispatch = dispatch;
      return next =>
        action => {
          action.meta = action.meta || {};
          action.meta.src = action.meta.src || 'addon';
          if (action.meta.src === 'addon') {
            // eslint-disable-next-line prefer-const
            for (let port of this.ports) {
              try {
                port.emit('action', action);

                const evt = actionToWeb(action);
                if (evt !== NO_ACTION) {
                  port.emit('from-addon-to-web', evt);
                }
              } catch (e) {
                this.ports.delete(port);
              }
            }
          }
          return next(action);
        };
    };
  }
}
