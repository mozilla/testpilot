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

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

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

  browser.browserAction.setBadgeBackgroundColor({ color: '#0996f8' });

  browser.browserAction.onClicked.addListener(() => {
    // reset badge immediately
    browser.browserAction.setBadgeText({ text: '' });

    const baseUrl = getCurrentEnv().baseUrl;
    storage.set({ clicked: Date.now() });
    browser.tabs.create({
      url: `${baseUrl}${BROWSER_ACTION_LINK}`
    });
  });
}

async function updateBadgeTextOnNew(topic, { experiments, news_updates }) {
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

  // check for port number on local, we need to strip it off
  // to properly fetch cookies.
  const baseUrl = getCurrentEnv().baseUrl;
  const portIndex = baseUrl.indexOf(':8000');
  const cookieUrl = (portIndex > -1) ? baseUrl.substring(0, portIndex) : baseUrl;

  let lastViewed = 0;
  const cookie = await browser.cookies.get({
    url: cookieUrl,
    name: 'updates-last-viewed-date'
  });

  if (cookie) lastViewed = cookie.value;

  /* only show badge for news update if:
   * - has the "major" key
   * - update has been published in the past two weeks
   * - update has not been "seen" by the frontend (lastViewed)
   * - update has not been "seen" by the addon (clicked)
   */
  const twoWeeksAgo = Date.now() - TWO_WEEKS;
  const newsUpdates = (news_updates || []).filter((u) => u.major)
        .filter((u) => new Date(u.published).getTime() >= twoWeeksAgo)
        .filter((u) => new Date(u.published).getTime() >= new Date(lastViewed))
        .filter((u) => new Date(u.published).getTime() >= clicked);

  BROWSER_ACTION_LINK = (newExperiments.length || newsUpdates.length) > 0
    ? BROWSER_ACTION_LINK_BADGED
    : BROWSER_ACTION_LINK_NOT_BADGED;

  browser.browserAction.setBadgeText({
    text: (newExperiments.length || newsUpdates.length) > 0 ? '!' : ''
  });

  browser.browserAction.setBadgeText({
    text: (newExperiments.length || newsUpdates.length) > 0 ? '!' : ''
  });
}

// TODO: Remove this? Experiment in summoning the pop-up for surveys, can be
// called on a schedule if necessary
// eslint-disable-next-line no-unused-vars
function showSurveyPopup() {
  browser.browserAction.setPopup({ popup: '/survey-popup/index.html' });
  sendBootstrapMessage('clickBrowserAction');
}
