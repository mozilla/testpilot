/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';
import { ClientID } from 'resource://gre/modules/ClientID.jsm';
import Events from 'sdk/system/events';
import self from 'sdk/self';
import { Services } from 'resource://gre/modules/Services.jsm';
import { storage } from 'sdk/simple-storage';
import {
  TelemetryController
} from 'resource://gre/modules/TelemetryController.jsm';

import type Variants from './variants';

export type ExperimentPingData = {
  subject: string,
  data: string /* JSON { senderAddonId: string, testpilotPingData: any }*/
};

const EVENT_SEND_METRIC = 'testpilot::send-metric';
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants';
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants';
const startTime = (Services.startup.getStartupInfo().process: Date);

function makeTimestamp(timestamp: Date) {
  return Math.round((timestamp - startTime) / 1000);
}

function experimentPing(event: ExperimentPingData) {
  const timestamp = new Date();
  const { subject, data } = event;
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(`Dropping bad metrics packet: ${err}`);
  }

  AddonManager.getAddonByID(subject, addon => {
    const payload = {
      test: subject,
      version: addon.version,
      timestamp: makeTimestamp(timestamp),
      variants: storage.experimentVariants &&
        subject in storage.experimentVariants
        ? storage.experimentVariants[subject]
        : null,
      payload: parsed
    };
    TelemetryController.submitExternalPing('testpilottest', payload, {
      addClientId: true,
      addEnvironment: true
    });

    // TODO: DRY up this ping centre code here and in lib/Telemetry.
    const pcPing = TelemetryController.getCurrentPingData();
    pcPing.type = 'testpilot';
    pcPing.payload = payload;
    const pcPayload = {
      // 'method' is used by testpilot-metrics library.
      // 'event' was used before that library existed.
      event_type: parsed.event || parsed.method,
      client_time: makeTimestamp(parsed.timestamp || timestamp),
      addon_id: subject,
      addon_version: addon.version,
      firefox_version: pcPing.environment.build.version,
      os_name: pcPing.environment.system.os.name,
      os_version: pcPing.environment.system.os.version,
      locale: pcPing.environment.settings.locale,
      raw: JSON.stringify(pcPing),
      // Note: these two keys are normally inserted by the ping-centre client.
      client_id: ClientID.getCachedClientID(),
      topic: 'testpilot',
    };
    // Add any other extra top-level keys from the payload, possibly including
    // 'object' or 'category', among others.
    Object.keys(parsed).forEach(f => {
      // Ignore the keys we've already added to `pcPayload`.
      const ignored = ['event', 'method', 'timestamp'];
      if (!ignored.includes(f)) {
        pcPayload[f] = parsed[f];
      }
    });

    Services.appShell.hiddenDOMWindow.navigator.sendBeacon(
      'https://onyx_tiles.stage.mozaws.net/v3/links/ping-centre',
      JSON.stringify(pcPayload));
  });
}

function receiveVariantDefs(event: ExperimentPingData) {
  if (!storage.experimentVariants) {
    storage.experimentVariants = {};
  }

  const { subject, data } = event;
  const dataParsed = this.variants.parseTests(JSON.parse(data));

  storage.experimentVariants[subject] = dataParsed;
  Events.emit(EVENT_SEND_VARIANTS, {
    data: JSON.stringify(dataParsed),
    subject: self.id
  });
}

export default class Experiment {
  variants: Variants;
  receiveVariantDefs: Function;
  constructor(variants: Variants) {
    this.variants = variants;
    this.receiveVariantDefs = receiveVariantDefs.bind(this);
    Events.on(EVENT_SEND_METRIC, experimentPing);
    Events.on(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs);
  }

  static ping(event: ExperimentPingData) {
    experimentPing(event);
  }

  teardown() {
    Events.off(EVENT_SEND_METRIC, experimentPing);
    Events.off(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs);
  }
}
