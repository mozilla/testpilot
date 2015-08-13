const {Cc,Ci,Cr} = require("chrome");

var self = require('sdk/self');
var pageMod = require("sdk/page-mod");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

// TODO: Make these configurable in prefs?
var CONTENT_URL = 'http://localhost:8899/stub-content/index.html';
var ALLOWED_ORIGINS = [
  'http://localhost:8899/*',
  'https://ideatown.firefox.com/*',
  'https://mozilla.github.io/idea-town-addon/stub-content/',
  'https://lmorchard.github.io/idea-town-addon/stub-content/'
];

pageMod.PageMod({
  include: ALLOWED_ORIGINS,
  contentScriptFile: self.data.url("message-bridge.js"),
  contentScriptWhen: 'start',
  onAttach: setupWorker
});

var button = buttons.ActionButton({
  id: "idea-town-link",
  label: "Idea Town",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: function () {
    // Look for an existing tab, close if found.
    // TODO: This might not be the best thing
    for each (var tab in tabs) {
      if (tab.url === CONTENT_URL) { tab.close(); }
    }
    // Otherwise, open a new tab.
    tabs.open({ url: CONTENT_URL });
  }
});

function setupWorker (worker) {
  worker.port.on('from-web-to-addon', function (msg) {
    if (!msg.type) { return; }
    switch (msg.type) {
      case 'loaded':
        sendToWeb(worker, { type: 'addon-available' });
        break;
      case 'thing1':
        thing1(worker, msg.data);
        break;
      default:
        console.log('ADDON RECEIVED FROM WEB', msg);
        sendToWeb(worker, { type: 'echo', data: msg });
        break;
    }
  });
}

function sendToWeb(worker, data) {
  worker.port.emit('from-addon-to-web', data);
}

function thing1 (worker, data) {
  appendNotificationBox({
    value: 'idea-town-feed-detected',
    label: 'Idea Town has an idea for this page.',
    buttons: [
      { label: "Make it happen!",
        accessKey: "w", popup: null,
        callback: function (bar, button) {
          sendToWeb(worker, { type: 'alert', message: "MAKING IT HAPPEN" });
        }
      },
      { label: "I like ideas!",
        accessKey: "p", popup: null,
        callback: function (bar, button) {
          sendToWeb(worker, { type: 'alert', message: "IDEAS LIKED" });
          sendToWeb(worker, "IDEAS ARE LIKED");
        }
      },
      { label: "Go away",
        accessKey: "s", popup: null,
        callback: function (bar, button) {
          sendToWeb(worker, { type: 'alert', message: "GOING AWAY" });
        }
      },
    ]
  });
}

function appendNotificationBox(options) {

  var WM = Cc['@mozilla.org/appshell/window-mediator;1'].
    getService(Ci.nsIWindowMediator);
  var win = WM.getMostRecentWindow('navigator:browser');
  var browser = win.gBrowser;
  var notifyBox = browser.getNotificationBox();

  var label    = options.label || 'Default label';
  var value    = options.value || 'Default value';
  var image    = options.image;
  var buttons  = options.buttons || [];
  var priority = options.priority || notifyBox.PRIORITY_INFO_LOW;
  var persistence = options.persistence || 0;

  var box = notifyBox.appendNotification(
    label, value, image, priority, buttons);

  box.persistence = persistence;

}
