/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

import PubSub from 'pubsub-js';

import allTopics from '../../lib/topics';
import { log } from './utils';
import { getCurrentEnv } from './environments';
import { sendBootstrapMessage } from './bootstrap';

const webExtensionTopics = (...args) => allTopics('webExtension', ...args);
const environmentTopics = (...args) =>
  webExtensionTopics('environment', ...args);

const storage = browser.storage.local;

const BROWSER_ACTION_LINK_BASE = [
  '/experiments',
  '?utm_source=testpilot-addon',
  '&utm_medium=firefox-browser',
  '&utm_campaign=testpilot-doorhanger'
].join('');
const BROWSER_ACTION_LINK_NOT_BADGED = BROWSER_ACTION_LINK_BASE +
  '&utm_content=not+badged';
const BROWSER_ACTION_LINK_BADGED = BROWSER_ACTION_LINK_BASE +
  '&utm_content=badged';
let BROWSER_ACTION_LINK = BROWSER_ACTION_LINK_NOT_BADGED;

export async function setupBrowserAction() {
  log('setupBrowserAction');

  PubSub.subscribe(environmentTopics('resources'), updateBadgeTextOnNew);

  browser.browserAction.onClicked.addListener(() => {
    const baseUrl = getCurrentEnv().baseUrl;
    storage.set({ clicked: Date.now() });
    browser.tabs.create({
      url: `${baseUrl}${BROWSER_ACTION_LINK}`
    });
  });
}

async function updateBadgeTextOnNew(topic, { experiments }) {
  let { clicked } = await storage.get('clicked');
  if (!clicked) {
    // Set initial button click timestamp if not found
    clicked = Date.now();
    await storage.set({ clicked });
  }

  const newExperiments = (experiments.results || []).filter(experiment => {
    const dt = new Date(experiment.modified || experiment.created).getTime();
    return dt >= clicked;
  });

  BROWSER_ACTION_LINK = newExperiments.length > 0
    ? BROWSER_ACTION_LINK_BADGED
    : BROWSER_ACTION_LINK_NOT_BADGED;

  browser.browserAction.setBadgeText({
    text: newExperiments.length > 0 ? browser.i18n.getMessage('new_badge') : ''
  });
}

// TODO: Remove this? Experiment in summoning the pop-up for surveys, can be
// called on a schedule if necessary
// eslint-disable-next-line no-unused-vars
function showSurveyPopup() {
  browser.browserAction.setPopup({ popup: '/survey-popup/index.html' });
  sendBootstrapMessage('clickBrowserAction');
}
