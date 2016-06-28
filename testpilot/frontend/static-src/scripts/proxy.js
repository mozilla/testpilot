var TELEMETRY_PINGS_KEY = 'telemetryPings';
var TELEMETRY_PINGS_MAX_COUNT = 10;

// Parse queued telemetry pings from a cookie
function parseTelemetryPings() {
  var pings;
  try { pings = JSON.parse(Cookies.get(TELEMETRY_PINGS_KEY)); }
  catch (e) { pings = []; }
  return pings;
}

window.addEventListener('message', function(ev) {
  // Only listen for messages from add-ons and webextensions
  if (ev.origin.indexOf('moz-extension://') !== 0 &&
      ev.origin.indexOf('resource://testpilot-addon') !== 0) {
    return;
  }

  if (ev.data.op === 'queueTelemetryPing') {
    // Parse the current list of pings, add this new one.
    var pings = parseTelemetryPings();
    pings.push(ev.data.data);
    // Drop some older pings, if we have too many.
    while (pings.length > TELEMETRY_PINGS_MAX_COUNT) { pings.shift(); }
    // Serialize the queue back into a cookie.
    Cookies.set(TELEMETRY_PINGS_KEY, JSON.stringify(pings));
    return;
  }

  if (ev.data.op === 'fetchTelemetryPings') {
    // Parse the current list of pings, clear the queue.
    var pings = parseTelemetryPings();
    Cookies.set(TELEMETRY_PINGS_KEY, JSON.stringify([]));
    // Send the list of pings back to the requester
    ev.source.postMessage({
      op: 'telemetryPings',
      data: JSON.stringify(pings)
    }, '*');
    return;
  }
});
