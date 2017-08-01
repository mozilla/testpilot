/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */
import PubSub from 'pubsub-js';
import allTopics from '../../lib/topics';
import { log } from './utils';

const webExtensionAPITopics = (...args) =>
  allTopics('bootstrap', 'webExtensionAPI', ...args);

export async function setupBootstrapPort() {
  log('setupBootstrapPort');

  // Mirror bootstrap port messages as PubSub topics
  const port = browser.runtime.connect({ name: 'main' });
  port.onMessage.addListener(({ op, message }) => {
    PubSub.publish(allTopics(...op.split('.')), message);
  });
}

export function sendBootstrapMessage(op, message) {
  return browser.runtime.sendMessage({
    op: webExtensionAPITopics(op),
    message
  });
}
