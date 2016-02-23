# Test Pilot
The addon where ideas come to idea

## installation

`npm install`

## configuration

prod: check the `CONFIG` property in `package.json`
dev: [dev-prefs.json](dev-prefs.json)

## running

* `npm start`

You may need to set both `xpinstall.signatures.required` and
`xpinstall.whitelist.required` flags to false in `about:config`
if the addon has not yet been signed.

If you want to install the xpi locally for dev, you will need to
set your preferences in `about:addons`. You'll want to use the preferences
from [dev-prefs.json](./dev-prefs.json).

## packaging

`npm run package`

## Events

Accepted:
* `install-experiment`
* `uninstall-experiment`
* `uninstall-all`
* `sync-installed`

Emitted:
* `sync-installed-result`
* `addon-install:install-started`
* `addon-install:install-new`
* `addon-install:install-cancelled`
* `addon-install:install-ended`
* `addon-install:install-failed`
* `addon-install:download-started`
* `addon-install:download-progress`
* `addon-install:download-ended`
* `addon-install:download-cancelled`
* `addon-install:download-failed`
* `addon-uninstall:uninstall-started`
* `addon-uninstall:uninstall-ended`
* `addon-self:installed`
* `addon-self:enabled`
* `addon-self:upgraded`
* `addon-self:uninstalled`

Any emitted events prefixed with `addon-install:` will have an associated object
which will be structured as such:

``` json
{
  "name": "Fox Splitter",
  "error": 0,
  "state": 6,
  "version": "2.1.2012122901.1-signed",
  "progress": 517308,
  "maxProgress": 517308
}

```
The event `addon-install:install-ended` will include some extra properties:

``` json
{
  "id": "foxsplitter@sakura.ne.jp",
  "name": "Fox Splitter",
  "error": 0,
  "state": 6,
  "version": "2.1.2012122901.1-signed",
  "progress": 517308,
  "maxProgress": 517308,
  "description": "Splits browser window as you like.",
  "homepageURL": "http://piro.sakura.ne.jp/xul/foxsplitter/index.html.en",
  "iconURL": "file:///tmp/074a4b62-239e-49bb-b75a-4935c349855c/extensions/foxsplitter@piro.sakura.ne.jp/icon.png",
  "size": 511221,
  "signedState": 2,
  "permissions": 13
}
```

#### Talking to the addon

You will need to setup the following function (or an equivalent) to send messages to the addon.

``` javascript
function sendToAddon (data) {
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-web-to-addon', { bubbles: true, detail: data }
  ));
}
```
Then you can use the `sendToAddon` method to send messages.

``` javascript
sendToAddon({type: 'loaded'});
```
and to setup listeners.

``` javascript
window.addEventListener("from-addon-to-web", function (event) {
  if (!event.detail || !event.detail.type) { return; }
  statusUpdate(event.detail.type, event.detail);
  switch (event.detail.type) {
    case 'sync-installed':
      syncInstalledAddons(event.detail);
      break;
    default:
      console.log('WEB RECEIVED FROM ADDON', JSON.stringify(event.detail, null, ' '));
      break;
  }
}, false);
```

Submit updates:
``` javascript
sendToAddon({type: 'install-experiment', detail: {xpi_url: 'https://people.mozilla.com/~jhirsch/universal-search-addon/addon.xpi'}});
```

## Maintainers

* Dave Justice <djustice@mozilla.com
* Les Orchard <lorchard@mozilla.com>

## Attribution

Arrow Icon made by
[Appzgear](http://www.flaticon.com/authors/appzgear) from
[www.flaticon.com](http://www.flaticon.com) is licensed by
[CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)
