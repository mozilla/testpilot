[👈 Back to README](../README.md)

# Test Pilot
The add-on where ideas come to idea

## Setup

`npm install`

`npm test` runs the unit test suite

`npm start` will build the addon and post it to the Extension Auto-Installer

## configuration

see [`../docs/development/environment.md`](../docs/development/environment.md) to configure which server environment the addon connects to.

## development

A relatively easy path for working on this addon involves the following steps:

1. Install [Firefox Developer Edition][devedition].

1. Install the [DevPrefs][devprefs] Add-on, which sets a number of preferences
   necessary for Add-on development, importantly `xpinstall.signatures.required`
   and `xpinstall.whitelist.required`.

1. Install the [Extension Auto-Installer][autoinstaller] Add-on in Firefox
   Developer Edition.

1. In the this directory, run `npm start` to build and run the addon in
   firefox.

1. Read all about [setting up an extension development
   environment][extensiondev] on MDN.

[devedition]: https://www.mozilla.org/en-US/firefox/developer/
[devprefs]: https://addons.mozilla.org/en-US/firefox/addon/devprefs/
[autoinstaller]: https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/
[extensiondev]: https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment
[quickstart]: ../docs/development/quickstart.md

## tests

`npm test` - just runs the unit tests quickly
`npm run slow-test` - runs flow and the unit tests with coverage
`npm run coverage` - runs both flow and the unit tests with coverage

## packaging

`npm run package` builds an unsigned xpi for local testing
`npm run sign` builds a signed xpi

## Design Notes

The addon uses [Redux](http://redux.js.org) to manage app state. Side effects are handled in a similar way to the [Elm Architecture Effects Model](https://guide.elm-lang.org/architecture/effects/). Actions that trigger side effects do so by returning a function from the `sideEffects` reducer. That function gets executed by a store subscriber (created by `sideEffects.enable(store)` in `main.js`) after the dispatch has completed, keeping the reducers pure. You'll notice that the default return value of the reducer is an empty function which prevents the previous side effect from running again.


## Code Organization

`/src/main.js`

- the main entrypoint for the addon

`/src/lib/actionCreators`

- contains modules that create [actions](http://redux.js.org/docs/basics/Actions.html)
- most of the "work" happens here

`/src/lib/metrics`

- contains the API for experiment metrics

`/src/lib/middleware`

- contains Redux middleware for communicating with the web app.

`/src/lib/reducers`

- all state changes are made here

`/data`

- assets for the addon

`/flow-typed`

- Flow type declarations

`/tasks`

- build tasks, etc.

`/test`

- unit tests

`tools`

- helpful development tools
