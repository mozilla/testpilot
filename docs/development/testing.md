[👈 Back to README](../../README.md)

# Testing

We have several mechanisms for testing parts of Test Pilot. All of these tests
must pass for Pull Requests to be accepted into the project, so it's very
handy to know how to run them and write new ones as code changes.

# Lint

We use the recommended mozilla-central lint rules. See the
[source for eslint-plugin-mozilla][source] for details about the rules.

We also use the following eslint plugin recommended rules:

 - eslint-plugin-import
 - eslint-plugin-flowtype
 - eslint-plugin-react

To lint the frontend, run `npm run lint` in the testpilot directory.
To lint the addon, run `npm run lint` in the addon directory.

To lint only one file in the frontend, run eslint inside the testpilot directory:

    ./node_modules/.bin/eslint [path/to/file.js]

To lint only one file in the addon, run eslint inside the addon directory:

    ./node_modules/.bin/eslint -c ../.eslintrc [path/to/file.js]

[source]: https://dxr.mozilla.org/mozilla-central/source/tools/lint/eslint/eslint-plugin-mozilla


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

The tests expect the WebExtension to be built. If not you will receive an error
stating that the addon or webextension is not found.

Please follow the instructions [here](./quickstart.md).


### Test environment setup

The tests can be run on any modern version of Firefox, but to run the installation tests, you must
use Firefox Nightly. Firefox must also be executable from the command line. After installing, you can run
this command to see if it is:

```sh
firefox --version
```
### Run the tests
1. Install [Tox].
2. Download geckodriver [v0.19.1][geckodriver] or later and ensure it's
   executable and in your path.

```sh
tox
```

This will run the integration tests as well as [flake8][flake8].

## Changing or adding element selectors

[Selenium] allows for multiple types of HTML/CSS selection methods. The
documentation found [here][selenium-api] shows the different ways to use these
available methods.

The pytest plugin that we use for running tests has a number of advanced command
line options available. To see the options available, run `pytest --help`. The
full documentation for the plugin can be found [here][pytest-selenium].

[flake8]: http://flake8.pycqa.org/en/latest/
[geckodriver]: https://github.com/mozilla/geckodriver/releases/tag/v0.19.1
[pytest-selenium]: http://pytest-selenium.readthedocs.org/
[Selenium]: http://selenium-python.readthedocs.io/index.html
[selenium-api]: http://selenium-python.readthedocs.io/locating-elements.html
[Tox]: http://tox.readthedocs.io/
