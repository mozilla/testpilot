# Testing

We have several mechanisms for testing parts of Test Pilot.

## Server tests (Django)

- [Basic Django server tests](https://docs.djangoproject.com/en/1.9/topics/testing/).

## Front-end client tests

Tests for the front-end web client are written with
[tape](https://www.npmjs.com/package/tape) to produce
[tap](https://en.wikipedia.org/wiki/Test_Anything_Protocol) output, and run
with [testling](https://www.npmjs.com/package/testling).  We use
[tape-after](https://www.npmjs.com/package/tape-around) to extend tape
for `before` and `after` methods.

Here are a couple of tips to help out when testing client-side code:

* If you must modify `ampersand-app`, do it per test.
* Always call `app.reset()` at the end of each test(in the `after` method).
* If a new view is added, create a sanity test at the very least.
``` js

const test = around(tape)
               .after(t => {
                 app.reset();
                 t.end();
               });

test('Experiment row view renders', t => {
  t.plan(1);
  const view = new View();
  view.render();
  t.ok(view.query('#my-view-id'));
});

```
* Each test file should be started with the following snippet so we can have context for errors.

``` js
test(`Running Tests for ${__filename}`, a => a.end());
```

#### Running the tests

* `npm test` will run all of the tests in node or headless browser.
* `npm run test:general` will run general tests in node.
* `npm run test:client` will run client tests in a headless browser.
* `npm run test:browser` will start a web server for the tests to be run in a browser window.
* `npm run test:browser:live` "     " + live reload.
* `npm run test:cov` stats on code coverage.

#### OSX
If you are on OSX you will need to have a headless browser installed to run the client-side tests
in the terminal.
You can do this via https://github.com/graingert/slimerjs

or

`npm install -g slimerjs`

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
