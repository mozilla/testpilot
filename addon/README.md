Test Pilot main add-on
----------------------

This add-on serves a few basic purposes common to participation in any Test Pilot experiment:

* Toolbar button as a quick shortcut to Test Pilot.
* Notifications when experiments are updated and new ones arrive.
* Daily metric reporting about participation in experiments.

## Building and Development

First, ensure that you've followed [the quickstart guide](../docs/development/quickstart.md) for working on the Test Pilot site itself. This includes ensuring you've got the right version of Node.js (currently, [v6.x LTS](https://nodejs.org/dist/latest-v6.x/)).

```
cd addon
npm start
```

If you just want an XPI package of the add-on, use one of these commands:
```
npm run package      # builds for local dev by default
```

If your packaging for another environment then you must include some environment variables:
```
ENVIRONMENT_TITLE=production ENVIRONMENT_URL=https://testpilot.firefox.com/ npm run package
```

Here is the full list of urls for each environment:

```
ENVIRONMENT_TITLE=local ENVIRONMENT_URL=https://example.com/
ENVIRONMENT_TITLE=dev ENVIRONMENT_URL=https://testpilot.dev.mozaws.net/
ENVIRONMENT_TITLE=l10n ENVIRONMENT_URL=https://testpilot-l10n.dev.mozaws.net/
ENVIRONMENT_TITLE=stage ENVIRONMENT_URL=https://testpilot.stage.mozaws.net/
ENVIRONMENT_TITLE=production ENVIRONMENT_URL=https://testpilot.firefox.com/
```

If you'd like to actively work on the add-on, here are some additional steps to set up a more convenient workflow:

1. Install [Firefox Developer Edition][devedition]. (Nightly should work, too, but Dev Edition is preferred.)

[devedition]: https://www.mozilla.org/en-US/firefox/developer/

Finally, to start up an add-on build with file watching:
```
npm start
```

This command will watch as you edit files, rebuilding the add-on with every change and re-installing it in your browser by way of the web-ext tool.

1. make sure you select the correct environment in the test pilot options menu from `about:addons`. Defaults to 'production'.

## General architecture

This add-on is a [WebExtension][].

[WebExtension]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions

The entry point for the webextension lives in [`./background.js`](./background.js).

* A daily report of how many experiments are currently enabled


The details of what measurements are implemented for any particular experiment can be found with the respective source code repositories for each experiment, generally in a document at `docs/METRICS.md`.

For more general details on where these metric events are sent for measurement &
analysis, read [`../docs/metrics/index.md`](../docs/metrics/index.md).
