var EXPERIMENT_ID = 'webextension-example-1';

function sendTelemetryPing(data) {
  document.getElementById('tp-proxy').contentWindow.postMessage({
    op: 'queueTelemetryPing',
    data: {
      subject: EXPERIMENT_ID,
      data: data
    }
  }, '*');
}

// Start sending a ping with fake data every second.
setInterval(function () {
  sendTelemetryPing({
    timesThingClicked: parseInt(Math.random() * 100)
  });
}, 1000);
