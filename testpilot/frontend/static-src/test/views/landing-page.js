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
