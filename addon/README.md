Test Pilot main add-on
----------------------

This add-on serves a few basic purposes common to participation in any Test Pilot experiment:

* Toolbar button as a quick shortcut to Test Pilot.
* Notifications when experiments are updated and new ones arrive.
* General metrics reporting about participation in experiments and Test Pilot in general.
* Telemetry metrics support for bootstrap & WebExtension based experiments.
* Signals to about:home and mozilla.com websites indicating participation in Test Pilot.

## Building and Development

First, ensure that you've followed [the quickstart guide](../docs/development/quickstart.md) for working on the Test Pilot site itself. This includes ensuring you've got the right version of Node.js (currently, [v6.x LTS](https://nodejs.org/dist/latest-v6.x/)).

From there, you'll need to install dependencies specific to the add-on:
```
cd addon
npm install
```

If you just want an XPI package of the add-on, use one of these commands:
```
npm package      # Production mode without logging
npm package:dev  # Development mode with lots of Browser Console logging
```

If you'd like to actively work on the add-on, here are some additional steps to set up a more convenient workflow:

1. Install [Firefox Developer Edition][devedition].

1. Install the [DevPrefs][devprefs] Add-on, which sets a number of preferences
   necessary for Add-on development, importantly `xpinstall.signatures.required`
   and `xpinstall.whitelist.required`.

1. Install the [Extension Auto-Installer][autoinstaller] Add-on in Firefox
   Developer Edition.

1. Read all about [setting up an extension development
   environment][extensiondev] on MDN.

[devedition]: https://www.mozilla.org/en-US/firefox/developer/
[devprefs]: https://addons.mozilla.org/en-US/firefox/addon/devprefs/
[autoinstaller]: https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/
[extensiondev]: https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment

Finally, to start up an add-on build with file watching:
```
npm start
```

This command will watch as you edit files, rebuilding the add-on with every change and re-installing it in your browser by way of the [Extension Auto-Installer][autoinstaller] add-on.

## General architecture

This add-on is an [Embedded WebExtension add-on][] - it's a new-style Firefox WebExtension embedded in a legacy-style Bootstrap extension. The legacy wrapper provides capabilities that are not available to WebExtensions in general. This should ideally just be a transitional form where these capabilities are dropped from use over time or replaced by general-use alternatives.

[Embedded WebExtension add-on]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Embedded_WebExtensions

The entry point for the Bootstrap extension lives in [`./src/bootstrap.js`](./src/bootstrap.js), while the entry point for the embedded WebExtension lives in [`./src/webextension/background.js`](./src/webextension/background.js). Both of these entry points serve mainly to manage the startup & shutdown of the functional modules into which the add-on is broken up - these live in `./src/lib` and `./src/webextension/lib` respectively.

For the most part, these modules interact using publish/subscribe messaging hubs - one each for the Bootstrap and WebExtension side of things. The shared module at [`./src/lib/topics.js`](./src/lib/topics.js) lists topics for the hubs, as well as providing a utility to construct & validate these topic strings as they're used in modules. With the exception of the `webExtensionAPI` topics, most of these are named for the respective modules that broadcast the topics.

 The Bootstrap and WebExtension sides of the add-on also work together via message passing. Modules involved in this integration include:

 * [`./src/lib/webExtension.js`](./src/lib/webExtension.js) - Bootstrap-side module managing the following:
   * startup & shutdown of the embedded WebExtension;
   * utility to send messages to the WebExtension
   * utility to register service API handlers for WebExtension using `webExtensionAPI` pubsub topics;
   * relay `bootstrap.{events,channels,addonManager}` pubsub topics to the WebExtension
 * [`./src/webextension/bootstrap.js`](./src/webextension/bootstrap.js) - WebExtension-side module managing the following:
   * set up communication port to receive relayed pubsub topics from bootstrap side
   * utility to send messages to call service API handlers in bootstrap side

In general, the Bootstrap side of things exists to offer discrete services to
the WebExtension based around the elevated capabilities it requires. There are a
few exceptions to this pattern, which should be described in sections to follow.

## Environments

The Test Pilot site exists in several parallel deployments - production, stage, development, and local - each with a version of the site in a different stage of development. This add-on requires a preference change to work properly with each of these deployments. See [`../docs/development/environment.md`](../docs/development/environment.md) for more details.

Source files involved in managing enmvironment-specific settings can be found here:

* [`./src/prefs.js`](./src/prefs.js) - Bootstrap-side module that watches for changes in Test Pilot related preferences
* [`./src/webextension/environments.js`](./src/webextension/environments.js) - WebExtension-side module defining the available environments, also periodically refreshes information from the Test Pilot site such as the current list of experiments and news alerts.

## Toolbar button & notifications

The code implementing the toolbar button lives in [`./src/webextension/lib/browserAction.js`](./src/webextension/lib/browserAction.js). Clicking the button opens up the Test Pilot site, as appropriate for your currently-configured environment.

The `browserAction.js` module also subscribes to the `webExtension.environment.resources` topic sent by the `environment.js` module when Test Pilot site resources are refreshed. This updated information is used to decide whether a "New" indicator should be displayed on the button.

## General metrics & Telemetry support for experiments

Several basic measurement features are implemented in [`./src/webextension/metrics.js`](./src/webextension/metrics.js) - including the following:

* A unique identifier is generated on installing the main add-on
* Metric pings when any Test Pilot experiment is enabled or disabled
* A daily report of how many experiments are currently enabled

Additionally, this `metrics.js` module communicates with these Bootstrap modules to process metrics pings from different kinds of experiments:

* [`./src/lib/channels.js`](./src/lib/channels.js) - implements BroadcastChannel-based message passing from WebExtension experiments for metrics events.
* [`./src/lib/events.js`](./src/lib/events.js) - implements nsiObserver-based message passing from Bootstrap experiments for metric events.
* [`./src/lib/telemetry.js`](./src/lib/telemetry.js) - provides the ability to send metrics events to Firefox Telemetry, as well as elevated access to information about the Firefox client.

The `telemetry.js` on the Bootstrap side is also responsible for two more things:

* Turn on preferences related to metrics collection, while preserving the user's original settings that are restores on uninstalling Test Pilot.
* Send metric events on installation and uninstallation of the Test Pilot add-on, since the WebExtension cannot react to these events.

The details of what measurements are implemented for any particular experiment can be found with the respective source code repositories for each experiment, generally in a document at `docs/METRICS.md`.

For more general details on where these metric events are sent for measurement &
analysis, read [`../docs/metrics/index.md`](../docs/metrics/index.md).

## Participation Indicators

For certain whitelisted URLs - currently just `about:home` and `mozilla.com` sites and Test Pilot itself - these properties are injected into the window:

* `window.navigator.testpilotAddon = true` - indicates Test Pilot participation
* `window.navigator.testpilotAddonVersion = 2.0` - or current add-on version

Additionally, for the Test Pilot site, this property is included:

* `window.navigator.testpilotClientUUID = {unique id}` - a unique ID generated when the Test Pilot add-on is installed for metrics purposes

Interesting source files for this feature include the following:

* [`./src/chrome/scripts/frame-script.js`](./src/chrome/scripts/frame-script.js) - content process frame script that interacts with pages to inject the properties.
* [`./src/lib/frameScripts.js`](./src/lib/frameScripts.js) - Bootstrap-side module that injects the frame script into windows and relays property changes from the WebExtension side.
* [`./src/lib/webextension/environments.js`](./src/lib/webextension/environments.js) - WebExtension-side module that determines which Test Pilot site environment is active, defines the whitelist of sites for property injection.
* [`./src/lib/webextension/metrics.js`](./src/lib/webextension/metrics.js) - WebExtension-side module that generates the unique client UUID for metrics purposes.
