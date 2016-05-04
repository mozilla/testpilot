import tape from 'tape-catch';
import around from 'tape-around';
import View from '../../app/views/landing-page';
import app from 'ampersand-app';
import Me from '../../app/models/me';

tape(`Running Tests for ${__filename}`, a => a.end());

const test = around(tape)
  .before(t => {
    app.me = new Me({
      user: {
        addon: {url: '/bleh'}
      }
    });
    app.sendToGA = () => { /* no-op */ };
    t.end();
  })
  .after(t => {
    app.reset();
    t.end();
  });

test('Landing Page view renders', t => {
  t.plan(1);

  const view = new View();
  view.render();

  t.ok(view.query('#main-header'));
});

test('Properly checks loggedIn state', t => {
  t.plan(2);

  const view = new View();
  view.render();

  t.notOk(view.loggedIn);

  app.me.user.id = 'gary@busey.net';
  view.render();

  t.ok(view.loggedIn);
});

test('Expected sendToGA call made when logged out', t => {
  t.plan(3);
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === false, 'is not logged in');
    t.ok(data.dimension2 === null, 'null dimension2');
    t.ok(data.dimension3 === null, 'null dimension3');
  };
  const view = new View();
  view.render();
});

test('Expected sendToGA call made with no experiments', t => {
  t.plan(3);
  app.me.user.id = 'gary@busey.net';
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'is logged in');
    t.ok(data.dimension2 === false, 'no experiments installed');
    t.ok(data.dimension3 === 0, '0 experiment count');
  };
  const view = new View();
  view.render();
});

test('Expected sendToGA call made with installed experiments', t => {
  t.plan(3);
  app.me.user.id = 'gary@busey.net';
  app.me.installed = [
    {'addon_id': '@experiment1'},
    {'addon_id': '@experiment2'}
  ];
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'is logged in');
    t.ok(data.dimension2 === true, 'experiments are installed');
    t.ok(data.dimension3 === 2, '2 experiments are installed');
  };
  const view = new View();
  view.render();
});

// Issue #703
test('No error when sendToGA called and app.me.installed is undefined', t => {
  t.plan(4);
  app.me.user.id = 'gary@busey.net';
  delete app.me.installed;
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'is logged in');
    t.ok(data.dimension2 === false, 'no experiments installed');
    t.ok(data.dimension3 === 0, '0 experiment count');
  };
  const view = new View();
  view.render();
  t.ok(view.query('#main-header'));
});
