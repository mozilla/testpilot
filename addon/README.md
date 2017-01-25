# X-16

## Setup

**DO NOT run this addon alongside the TestPilot Addon**

`npm install`

`npm test` runs the unit test suite

`npm start` will build the addon and post it to the Extension Auto-Installer


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
