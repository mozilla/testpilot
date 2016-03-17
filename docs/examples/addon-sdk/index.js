const self = require("sdk/self");

const {ToggleButton} = require('sdk/ui/button/toggle');
const {Panel} = require('sdk/panel');
const Events = require("sdk/system/events");

// TODO: Move this into a shared library?
function sendMetricsPing(self, payload) {
  Events.emit('testpilot::send-metric', {
    subject: self.id,
    data: JSON.stringify(payload)
  });
}

let panel, button;

exports.main = function (options, callbacks) {

  panel = Panel({ // eslint-disable-line new-cap
    contentURL: './panel.html',
    contentScriptFile: './panel.js',
    onHide: () => {
      button.state('window', {checked: false});
    }
  });

  panel.port.on('buttonClicked', function (buttonID) {
    sendMetricsPing(self, {
      happening: 'buttonClicked',
      buttonID: buttonID
    });
  });

  button = ToggleButton({ // eslint-disable-line new-cap
    id: "experiment-1-link",
    label: "Experiment 1",
    icon: {
      "16": "./icon-16.png",
      "32": "./icon-32.png",
      "64": "./icon-64.png"
    },
    onChange: (state) => {

      sendMetricsPing(self, {
        happening: 'buttonStateChange',
        currentState: state.checked
      });

      if (!state.checked) { return; }

      panel.show({
        width: 200,
        height: 200,
        position: button
      });

    }
  });

};

exports.onUnload = function (reason) {
  panel.destroy();
  button.destroy();
};
