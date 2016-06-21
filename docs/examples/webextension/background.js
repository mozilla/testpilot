var TESTPILOT_TELEMETRY_CHANNEL = 'testpilot-telemetry';
var testpilotPingChannel = new BroadcastChannel(TESTPILOT_TELEMETRY_CHANNEL);
setInterval(function () {
  testpilotPingChannel.postMessage({
    boolData: true,
    arrayOfData: ["one", "two", "three"],
    nestedData: {
      intData: 10,
    },
  });
  console.log("TEST PILOT PING SENT", Date.now());
}, 5000);
