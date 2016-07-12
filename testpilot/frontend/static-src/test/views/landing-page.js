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

test('Properly checks hasAddon state', t => {
  t.plan(2);

  const view = new View();
  view.render();

  t.notOk(view.hasAddon);

  app.me.hasAddon = true;
  view.render();

  t.ok(view.hasAddon);
});

test('Expected sendToGA call made with no add-on', t => {
  t.plan(3);
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === false, 'does not have add-on');
    t.ok(data.dimension2 === null, 'null dimension2');
    t.ok(data.dimension3 === null, 'null dimension3');
  };
  const view = new View();
  view.render();
});

test('Expected sendToGA call made with no experiments', t => {
  t.plan(3);
  app.me.hasAddon = true;
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'has add-on');
    t.ok(data.dimension2 === false, 'no experiments installed');
    t.ok(data.dimension3 === 0, '0 experiment count');
  };
  const view = new View();
  view.render();
});

test('Expected sendToGA call made with installed experiments', t => {
  t.plan(3);
  app.me.hasAddon = true;
  app.me.installed = {
    '@experiment1': {},
    '@experiment2': {}
  };
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'has add-on');
    t.ok(data.dimension2 === true, 'experiments are installed');
    t.ok(data.dimension3 === 2, '2 experiments are installed');
  };
  const view = new View();
  view.render();
});

// Issue #703
test('No error when sendToGA called and app.me.installed is undefined', t => {
  t.plan(4);
  app.me.hasAddon = true;
  delete app.me.installed;
  app.sendToGA = (name, data) => {
    t.ok(data.dimension1 === true, 'does not have add-on');
    t.ok(data.dimension2 === false, 'no experiments installed');
    t.ok(data.dimension3 === 0, '0 experiment count');
  };
  const view = new View();
  view.render();
  t.ok(view.query('#main-header'));
});
