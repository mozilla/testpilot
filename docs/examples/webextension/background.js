fetch('https://testpilot.firefox.com/api/metrics/ping/testpilottest', {
  method: 'POST',
  mode: 'cors',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    "some": "random",
    "metrics": "ping",
    "payload": "here"
  })
}).then(resp => {
  console.log('metrics ping success', resp);
}).catch(e => {
  console.log('problem sending metrics ping', e);
});
