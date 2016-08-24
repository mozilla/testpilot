[👈 Back to README](../README.md)

# Test Pilot
The add-on where ideas come to idea

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [installation](#installation)
- [configuration](#configuration)
- [development](#development)
- [running once for testing](#running-once-for-testing)
- [packaging](#packaging)
- [distributing](#distributing)
- [Events](#events)
    - [Talking to the addon](#talking-to-the-addon)
- [Maintainers](#maintainers)
- [Attribution](#attribution)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## installation

`npm install`

## configuration

prod: check the `CONFIG` property in `package.json`
dev: [dev-prefs.json](dev-prefs.json)

see [`../docs/ADDON-ENVIRONMENT.md`](../docs/ADDON-ENVIRONMENT.md) to configure which server environment the addon connects to.

## development

A relatively easy path for working on this addon involves the following steps:

1. Install [Firefox Developer Edition][devedition].

2. Install the [DevPrefs][devprefs] Add-on, which sets a number of preferences
   necessary for Add-on development, importantly `xpinstall.signatures.required`
   and `xpinstall.whitelist.required`.

3. Install the [Extension Auto-Installer][autoinstaller] Add-on in Firefox
   Developer Edition.

4. Run `npm start` to fire up a watcher that will build the Test Pilot add-on
   whenever files change and auto-update the installed version in Firefox.

5. Read all about [setting up an extension development
   environment][extensiondev] on MDN.

[devedition]: https://www.mozilla.org/en-US/firefox/developer/
[devprefs]: https://addons.mozilla.org/en-US/firefox/addon/devprefs/
[autoinstaller]: https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/
[extensiondev]: https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment

For UI hacking you can run `npm run watch-ui` to easily debug `lib/templates.js` and `data/panel.css`

## tests

Unit tests for the add-on are run via `jpm` as an `npm` script:

```
npm test -- --binary=/Applications/Nightly.app/Contents/MacOS/firefox-bin
```

Look in the `test` directory for examples of tests.

## running once for testing

* Install [Firefox Beta][fxbeta]

* `npm run once`

This should package the add-on and fire up Firefox Beta using a fresh profile
with the add-on installed.

[fxbeta]: https://www.mozilla.org/en-US/firefox/channel/#beta

## packaging

`npm run sign`

## distributing

We serve the add-on from the `/static/addon/` directory. We will need
to get the add-on signed via [AMO](http://addons.mozilla.org/) and move
it into the correct directory. This is all packaged into a script,
`npm run sign` in the [package.json](./package.json).

## Events

Accepted:
* `install-experiment`
* `uninstall-experiment`
* `uninstall-self`
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
* `addon-manage:enabled`
* `addon-manage:disabled`
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

#### Talking to the add-on

You will need to setup the following function (or an equivalent) to send messages to the add-on.

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

* Dave Justice <djustice@mozilla.com>
* Les Orchard <lorchard@mozilla.com>

## Attribution

Arrow Icon made by
[Appzgear](http://www.flaticon.com/authors/appzgear) from
[www.flaticon.com](http://www.flaticon.com) is licensed by
[CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)
