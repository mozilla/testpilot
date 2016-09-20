[👈 Back to README](../../README.md)

# Testing

We have several mechanisms for testing parts of Test Pilot.

## Front-end client tests

Front-end tests are currently disabled. See [Issue #1351](https://github.com/mozilla/testpilot/issues/1351) for updates.

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

Since integration tests exercise the whole stack, you'll need to ensure a few
things are set up before attempting to run them:

1. You should have a fully working instance of the Django server running at
   `http://testpilot.dev:8000`. [A normal Docker development setup should cover
   this](../README.md#development).

1. Ensure [you've built the add-on](../addon/README.md) using either `npm run
   package` or `npm run sign`. If you do not have AMO credentials to generate a
   signed package, you'll need to use `npm run package` and [download an
   unbranded build of Firefox][unbranded] to run the tests with an unsigned
   add-on.

1. Ensure you've built the web frontend with gulp, which should ensure the
   add-on get served up properly as well.

[unbranded]: https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds

Once you've got that whole stack available, you can run the tests like so:

```
pip install -r integration/requirements.txt
python integration/runtests.py \
    --binary=/Applications/Nightly.app/Contents/MacOS/firefox-bin \
    --verbose integration
```

The first line installs the requires Python modules. The second line starts an
instance of Firefox using a fresh profile and runs the integration tests
against it via Marionette.

The `--binary` option specifies the Firefox installation that the tests should
use. You can change it to launch any version you have available.
