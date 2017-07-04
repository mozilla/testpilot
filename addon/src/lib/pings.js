// Shared metrics ping formatting & logic for bootstrap and webextension, with
// some bits to fill in depending on local availability of APIs and data
const startTime = Date.now();

function makeTimestamp(timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000);
}

// HACK: Most of the parameters of this function come from different places
// depending on whether it's run in a bootstrap or a webextension context, so
// it's a bit messy. But, this seems better than copypasta code in two places
export async function submitMainPing(
  log,
  addonMetadata,
  clientUUID,
  telemetryClientID,
  submitExternalPing,
  environment,
  _fetch,
  _Headers,
  _URLSearchParams,
  object,
  event,
  time
) {
  log('submitMainPing', object, event, time);
  return Promise.all([
    submitExternalPing({
      topic: 'testpilot',
      payload: {
        timestamp: makeTimestamp(),
        test: addonMetadata.id,
        version: addonMetadata.version,
        events: [{ timestamp: makeTimestamp(time), event, object }]
      }
    }),
    sendPingCentreEvent(environment, _fetch, _Headers, telemetryClientID, {
      addon_id: addonMetadata.id,
      addon_version: addonMetadata.version,
      object,
      event,
      time
    }),
    sendGAEvent(_fetch, _URLSearchParams, clientUUID, {
      t: 'event',
      ec: 'add-on Interactions',
      ea: object,
      el: event
    })
  ]);
}

export async function sendPingCentreEvent(
  environment,
  _fetch,
  _Headers,
  telemetryClientID,
  payload
) {
  // TODO: Do we really need all this telemetry environment context?

  // A little work is required to replicate the ping sent to Telemetry
  // via the `submitExternalPing('testpilot', payload, opts)` call:
  const pcPayload = {
    event_type: payload.event || payload.method,
    client_time: makeTimestamp(payload.timestamp),
    firefox_version: environment.build.version,
    os_name: environment.system.os.name,
    os_version: environment.system.os.version,
    locale: environment.settings.locale,
    // Note: these two keys are normally inserted by the ping-centre client.
    // TODO: This is the telemetry client ID. Maybe change to add-on client UUID?
    client_id: telemetryClientID,
    topic: 'testpilot'
  };

  // Add any other extra top-level keys from the payload, possibly including
  // 'object' or 'category', among others.
  const ignored = ['event', 'method', 'timestamp'];
  Object.keys(payload)
    .filter(f => ignored.includes(f))
    .forEach(f => pcPayload[f] = payload[f]);

  return _fetch('https://tiles.services.mozilla.com/v3/links/ping-centre', {
    method: 'POST',
    headers: new _Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(pcPayload)
  });
}

export async function sendGAEvent(_fetch, _URLSearchParams, clientUUID, data) {
  data.v = 1;
  // Version -- https://developers.google.com/analytics/devguides/collection/protocol/v1/
  data.tid = 'UA-49796218-47';
  data.cid = clientUUID;
  return _fetch('https://ssl.google-analytics.com/collect', {
    method: 'POST',
    body: new _URLSearchParams(data)
  });
}
