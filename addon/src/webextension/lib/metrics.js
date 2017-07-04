/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser, Headers, URLSearchParams */

import PubSub from 'pubsub-js';

import allTopics from '../../lib/topics';
import { submitMainPing, sendPingCentreEvent } from '../../lib/pings';
import { log, debug } from './utils';
import { getResources } from './environments';
import { sendBootstrapMessage } from './bootstrap';

const webExtensionTopics = (...args) => allTopics('webExtension', ...args);
const environmentTopics = (...args) =>
  webExtensionTopics('environment', ...args);
const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
const eventsTopics = (...args) => bootstrapTopics('events', ...args);
const channelsTopics = (...args) => bootstrapTopics('channels', ...args);

const startTime = Date.now();

let availableAddons = [];
let addonMetadata = {};
let clientUUID = '';
let telemetryClientID = '';

function makeTimestamp(timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000);
}

export async function setupMetrics() {
  log('setupMetrics');

  addonMetadata = await sendBootstrapMessage('getAddonMetadata');
  availableAddons = await fetchAvailableAddons();
  telemetryClientID = await sendBootstrapMessage('getCachedClientID');
  clientUUID = await browser.storage.local.get('clientUUID').clientUUID;

  // Refresh available add-ons list whenever AddonManager does stuff
  PubSub.subscribe(bootstrapTopics('addonManager'), fetchAvailableAddons);

  // Set up daily idle ping with number of enabled experiments
  PubSub.subscribe(eventsTopics('idle-daily'), submitDailyPing);

  // Open channels for all known experiments
  PubSub.subscribe(environmentTopics('resources'), (_, { experiments }) => {
    (experiments.results || []).forEach(experiment => {
      const addonId = experiment.addon_id;
      sendBootstrapMessage('openChannel', {
        addonId,
        topic: 'testpilot-telemetry'
      });
    });
  });

  if (debug) {
    // HACK: open a channel for pings from the webextension in docs/examples
    // because it will never be listed as an experiment
    sendBootstrapMessage('openChannel', {
      addonId: 'testpilotexample1@mozilla.org',
      topic: 'testpilot-telemetry'
    });
  }

  // Handle telemetry pings from WebExtensions
  PubSub.subscribe(channelsTopics('testpilot-telemetry'), (message, data) =>
    submitExperimentPing(data));

  // Handle telemetry pings from legacy add-ons
  sendBootstrapMessage('observeEventTopic', 'send-metric');
  PubSub.subscribe(eventsTopics('send-metric'), (message, data) =>
    submitExperimentPing(data));

  // HACK: register-variants & receive-variants are defunct
  // TODO: should remove? the example add-on goes into loop without an answer
  sendBootstrapMessage('observeEventTopic', 'register-variants');
  PubSub.subscribe(eventsTopics('register-variants'), (message, data) => {
    log('register-variants', data);
    sendBootstrapMessage('notifyEventTopic', {
      topic: 'receive-variants',
      payload: {}
    });
  });
}

async function fetchAvailableAddons() {
  availableAddons = await sendBootstrapMessage('getAvailableAddons');
  return availableAddons;
}

async function submitDailyPing() {
  log('submitDailyPing');
  const { experiments } = getResources();
  const enabledExperiments = (experiments.results || [])
    .filter(experiment => experiment.addon_id in availableAddons);
  return sendBootstrapMessage('getTelemetryEnvironment').then(environment => {
    submitMainPing(
      log,
      addonMetadata,
      clientUUID,
      telemetryClientID,
      submitExternalPing,
      environment,
      fetch,
      Headers,
      URLSearchParams,
      enabledExperiments.length.toString(),
      'daily'
    );
  }).catch(err => log('submitDailyPing error', err));
}

async function submitExternalPing(data) {
  return sendBootstrapMessage('submitExternalPing', data);
}

export async function submitExperimentPing({ subject, payload }) {
  log('submitExperimentPing', subject, payload);

  const timestamp = makeTimestamp(new Date());
  const addon = availableAddons[subject];
  if (!addon) {
    // eslint-disable-next-line no-console
    return console.error(
      `Dropping bad metrics packet: unknown addon ${subject}`
    );
  }

  return Promise.all([
    submitExternalPing({
      topic: 'testpilottest',
      payload: {
        timestamp,
        test: subject,
        version: addon.version,
        payload
      }
    }),
    sendBootstrapMessage('getTelemetryEnvironment').then(environment =>
      sendPingCentreEvent(
        environment,
        fetch,
        Headers,
        Object.assign(
          { timestamp, addon_id: subject, addon_version: addon.version },
          payload
        )
      ))
  ]);
}
