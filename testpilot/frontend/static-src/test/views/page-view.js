import tape from 'tape-catch';
import around from 'tape-around';
import View from '../../app/views/page-view';
import app from 'ampersand-app';
import Me from '../../app/models/me';

const MyView = View.extend({
  template: `<div class="page">
               <header data-hook="main-header"></header>
               <footer data-hook="main-footer"></footer>
             </div>`});

tape(`Running Tests for ${__filename}`, a => a.end());

const test = around(tape)
  .before(t => {
    app.me = new Me({
      user: {
        id: 'gary@busey.net'
      }
    });
    t.end();
  })
  .after(t => {
    app.reset();
    t.end();
  });

test('Page view renders', t => {
  t.plan(1);
  const view = new MyView({headerScroll: true});
  view.render();
  t.ok(view.query('.page'));
});

test('header is present', t => {
  t.plan(2);
  const view = new MyView({headerScroll: true});

  app.me.hasAddon = true;
  view.render();
  t.ok(view.query('#main-header'), 'Header present for user with add-on.');

  app.me.hasAddon = false;
  view.render();
  t.ok(view.query('#main-header'), 'Header present for user without add-on.');
});

test('footer is present', t => {
  t.plan(1);
  const view = new MyView({headerScroll: true});
  view.render();
  t.ok(view.query('#footer-links'));
});
