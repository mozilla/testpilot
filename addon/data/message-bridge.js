// Page script acts as messaging bridge between addon and web content.

// Relay messages from web to addon.
window.addEventListener("from-web-to-addon", function (event) {
  self.port.emit('from-web-to-addon', event.detail);
}, false);

// Relay messages from addon to web.
self.port.on('from-addon-to-web', function (data) {
  var clonedDetail = cloneInto(data, document.defaultView);
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-addon-to-web', { bubbles: true, detail: clonedDetail }
  ));
});
