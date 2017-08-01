/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

import PubSub from 'pubsub-js';

import allTopics from '../../lib/topics';
import { log } from './utils';
import { sendBootstrapMessage } from './bootstrap';

export const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
export const webExtensionTopics = (...args) =>
  allTopics('webExtension', ...args);
export const environmentTopics = (...args) =>
  webExtensionTopics('environment', ...args);

export const environments = {
  local: {
    name: 'local',
    baseUrl: 'https://example.com:8000',
    whitelist: 'https://www.mozilla.org/,about:home'
  },
  dev: {
    name: 'dev',
    baseUrl: 'https://testpilot.dev.mozaws.net',
    whitelist: 'https://www.mozilla.org/,about:home'
  },
  stage: {
    name: 'stage',
    baseUrl: 'https://testpilot.stage.mozaws.net',
    whitelist: 'https://www.mozilla.org/,about:home'
  },
  production: {
    name: 'production',
    baseUrl: 'https://testpilot.firefox.com',
    whitelist: 'https://www.mozilla.org/,about:home'
  }
};

const RESOURCE_UPDATE_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours

const resources = {
  experiments: null,
  news_updates: null
};

let currentEnvironment = environments.production;

export async function setupEnvironment() {
  log('setupEnvironment');
  PubSub.subscribe(bootstrapTopics('prefs', 'prefsChange'), (message, data) => {
    const env = setCurrentEnv(data['testpilot.env']);
    sendBootstrapMessage('updateEnvironment', env);
  });
  setInterval(fetchResources, RESOURCE_UPDATE_INTERVAL);
  PubSub.subscribe(environmentTopics('change'), fetchResources);
}

export function getCurrentEnv() {
  return currentEnvironment;
}

export function setCurrentEnv(env) {
  currentEnvironment =
    env in environments ? environments[env] : environments.production;
  PubSub.publish(environmentTopics('change'), currentEnvironment);
  return currentEnvironment;
}

export function getResources() {
  return resources;
}

async function fetchResources() {
  log('fetchResources');
  return Promise.all(
    Object.keys(resources).map(path =>
      fetch(`${currentEnvironment.baseUrl}/api/${path}.json`)
        .then(response => response.json())
        .then(data => [path, data])
        .catch(err => {
          log('fetchResources error', path, err);
          return [path, null];
        })
    )
  ).then(results => {
    log('fetchResources results', results);
    results.forEach(([path, data]) => (resources[path] = data));
    PubSub.publish(environmentTopics('resources'), resources);
  });
}
