[👈 Back to README](../../README.md)

# Testing

We have several mechanisms for testing parts of Test Pilot. All of these tests
must pass for Pull Requests to be accepted into the project, so it's very 
handy to know how to run them and write new ones as code changes.

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

Integration tests that exercise the entire stack consisting of the server, web
front-end, and Firefox add-on are written in Python using [Marionette][] and
[Firefox Puppeteer][].

Most features of the site should be covered first by unit tests. But, since
Test Pilot has many parts communicating with each other, we need integration
tests to cover some of the critical interactions.

[marionette]: https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette
[firefox puppeteer]: http://firefox-puppeteer.readthedocs.io/en/aurora/index.html

### Running the tests

Before running the integration tests, make sure you've completed the
[Development Quickstart][quickstart] steps. That should leave you with a
running local dev server, a packaged add-on, and a build of the web front-end.
The integration tests require all of these things.

You will also need [an unbranded build of Firefox][unbranded] to use the
packaged but unsigned build of the add-on in tests. A normal release version
of Firefox will refuse to install the unsigned add-on, and so the tests will
fail.

[quickstart]: https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md
[unbranded]: https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds

Once you've got that whole stack available, you can run the tests like so:

```
pip install -r integration/requirements.txt
python integration/runtests.py \
    --binary=/Applications/Nightly.app/Contents/MacOS/firefox-bin \
    --verbose integration/test_installation.py
```

The first line installs the requires Python modules. The second line starts an
instance of Firefox using a fresh profile and runs the integration tests
against it via Marionette.

The `--binary` option specifies the Firefox installation that the tests should
use. You can change it to launch any version you have available. In most cases,
this is where you would supply the location of [the unbranded build of
Firefox][unbranded].
