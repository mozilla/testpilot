[👈 Back to README](../../README.md)

# Testing

We have several mechanisms for testing parts of Test Pilot. All of these tests
must pass for Pull Requests to be accepted into the project, so it's very
handy to know how to run them and write new ones as code changes.

## All tests

To quickly run all tests, including addon tests, frontend tests, eslint checks, and flow types coverage reports, use `npm run test:all`.

## Front-end client tests

Our front-end is based on [React][] & [Redux][]. We use a combination of
[Mocha][], [Chai][], [Sinon][], & [Enzyme][] to build tests for it.  Reading
the docs for each of those projects is the most helpful, but we have plenty of
tests to review for inspiration in the [`frontend/test/app`][fetests]
directory.

After completing the [Development Quickstart][quickstart], you can run the
tests with the following command:

```
npm test
```

However, you can also run the tests on a file watcher, so that they get
executed with every change you make:

```
npm run test:watch
```

It's useful to have this running as you develop, because then you can see test
failures quickly and not have to remember to run the suite before submitting a
Pull Request.

[fetests]: https://github.com/mozilla/testpilot/tree/master/frontend/test/app
[react]: https://facebook.github.io/react/
[redux]: http://redux.js.org/
[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[sinon]: http://sinonjs.org/
[enzyme]: http://airbnb.io/enzyme/index.html

## Add-on tests

Unit tests for the add-on are run via `jpm` as an `npm` script in the `addon`
directory:

```
cd addon
npm install
npm test -- --binary=/Applications/Nightly.app/Contents/MacOS/firefox-bin
```

Look in the `addon/test` directory for examples of tests.

## Integration tests

Integration tests are currently disabled and being re-evaluated. See [Issue #1975][]
for details.

[Issue #1975]: https://github.com/mozilla/testpilot/issues/1975
