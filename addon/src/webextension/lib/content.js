/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

import PubSub from 'pubsub-js';

import { log } from './utils';
import allTopics from '../../lib/topics';

const contentTopics = (...args) =>
  allTopics('webExtension', 'content', ...args);

export async function setupContent() {
  log('setupContent');
  browser.runtime.onMessage.addListener(({ op, message }) => {
    PubSub.publish(contentTopics(op), message);
  });
  // TODO: Remove this? Experiment in summoning the pop-up for surveys
  PubSub.subscribe(contentTopics('clearPopup'), () => {
    browser.browserAction.setPopup({ popup: '' });
  });
}
