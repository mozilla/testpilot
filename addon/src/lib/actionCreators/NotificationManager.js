/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import * as notificationUI from '../notificationUI';
import { setTimeout, clearTimeout } from 'sdk/timers';

import type { ReduxStore } from 'testpilot/types';
import type { Experiment } from '../Experiment';

const ONE_DAY = 24 * 60 * 60 * 1000;
const MAX_NOTIFICATION_DELAY_PERIOD = 14 * ONE_DAY;

function selectNotification(notifications, lastNotified) {
  const now = Date.now();
  const eligible = notifications.filter(n => {
    const after = new Date(n.notify_after).getTime();
    return now - after < MAX_NOTIFICATION_DELAY_PERIOD &&
      now > after &&
      after > lastNotified;
  });
  return eligible[Math.floor(
    Math.random() * eligible.length
  )]; // undefined is ok
}

function nextCheckTime(notifications, nextCheck) {
  const now = Date.now();
  return notifications
    .map(n => new Date(n.notify_after).getTime())
    .reduce(
      (min, t) => {
        return t < now ? min : Math.min(min, t);
      },
      nextCheck
    );
}

export default class NotificationManager {
  store: ReduxStore;
  timeout: ?number;
  constructor(store: ReduxStore) {
    this.store = store;
    this.timeout = null;
  }

  schedule() {
    const { getState } = this.store;
    const nextCheck = getState().notifications.nextCheck;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        const { experiments } = getState();
        // eslint-disable-next-line prefer-const
        for (let id of Object.keys(experiments)) {
          this.maybeNotify(experiments[id]);
        }
      },
      nextCheck - Date.now()
    );
  }

  maybeNotify(experiment: Experiment) {
    const { dispatch, getState } = this.store;
    const { lastNotified, nextCheck } = getState().notifications;
    const n = selectNotification(experiment.notifications, lastNotified);
    let payload = null;
    if (n) {
      dispatch(
        actions.SHOW_NOTIFICATION({
          id: n.id,
          title: n.title,
          text: n.text,
          url: experiment.html_url
        })
      );
      payload = { nextCheck: Date.now() + ONE_DAY, lastNotified: Date.now() };
    } else {
      payload = {
        nextCheck: nextCheckTime(experiment.notifications, nextCheck),
        lastNotified: lastNotified
      };
    }
    dispatch(actions.SCHEDULE_NOTIFIER(payload));
  }

  showNotification(message: notificationUI.NotificationMessage) {
    notificationUI.notify(message);
  }
}
