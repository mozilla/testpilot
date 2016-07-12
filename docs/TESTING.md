# Testing

We currently have two different ways to write tests. Server tests are fairly
standard [django tests](https://docs.djangoproject.com/en/1.9/topics/testing/).
The client tests are written with [tape](https://www.npmjs.com/package/tape)
to produce [tap](https://en.wikipedia.org/wiki/Test_Anything_Protocol) output,
and run with [testling](https://www.npmjs.com/package/testling).
We use [tape-after](https://www.npmjs.com/package/tape-around) to extend tape
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
