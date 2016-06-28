const TELEMETRY_QUEUE_POLL_INTERVAL = 5000;
const proxyFrame = document.getElementById('tp-proxy');

// Periodically poll for queued telemetry pings
setInterval(function() {
  proxyFrame.contentWindow.postMessage({
    op: 'fetchTelemetryPings'
  }, '*');
}, TELEMETRY_QUEUE_POLL_INTERVAL);

// Listen for postMessage
window.addEventListener('message', function(ev) {
  if (ev.data.op === 'telemetryPings') {
    // Relay telemetryPings on to the add-on
    self.port.emit('telemetryPings', ev.data.data);
    return;
  }
});

// Listen for message from add-on to update iframe src
self.port.on('updateIFrameSrc', src => {
  proxyFrame.src = src;
});

self.port.emit('ready');
