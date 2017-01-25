/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import self from 'sdk/self';
import { ActionButton } from 'sdk/ui/button/action';
import type { ReduxStore } from 'testpilot/types';
import { addXULStylesheet } from '../xulcss';

addXULStylesheet(self.data.url('button.css'));

export default class MainUI {
  button: ActionButton;
  store: ReduxStore;
  constructor(store: ReduxStore) {
    this.store = store;
    this.button = new ActionButton({
      id: 'main',
      label: 'Test Pilot',
      icon: `./transparent-16.png`,
      onClick: () => {
        store.dispatch(actions.MAIN_BUTTON_CLICKED({ time: Date.now() }));
      }
    });
  }

  setBadge() {
    this.button.badge = this.store.getState().ui.badge;
  }
}
