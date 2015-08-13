// Listen for events from the addon and dispatch.
window.addEventListener("from-addon-to-web", function (event) {
  if (!event.detail || !event.detail.type) { return; }
  switch (event.detail.type) {
    case 'addon-available':
      handleWhenAddonAvailable(event.detail);
      break;
    default:
      console.log('WEB RECEIVED FROM ADDON', JSON.stringify(event.detail, null, ' '));
      break;
  }
}, false);

function sendToAddon (data) {
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-web-to-addon', { bubbles: true, detail: data }
  ));
}

function handleWhenAddonAvailable () {
  document.body.classList.add('addon-available');
}

document.querySelector('button#thing1').addEventListener('click', function (ev) {
  sendToAddon({ type: 'thing1' });
});

sendToAddon({ type: 'loaded' });
