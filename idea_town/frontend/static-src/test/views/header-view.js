import tape from 'tape-catch';
import around from 'tape-around';
import View from '../../app/views/header-view';
import app from 'ampersand-app';
import Me from '../../app/models/me';

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

test('header view renders', t => {
  t.plan(1);
  const view = new View({headerScroll: false});
  view.render();
  t.ok(view.query('.navbar'));
});

test('Settings menu subview renders', t => {
  t.plan(1);
  const view = new View({headerScroll: false});
  view.render();
  t.ok(view.query('.settings-contain'));
});

test('render called on `change:hasAddon` event', t => {
  t.plan(1);

  let renderCalled = 0;
  const MyView = View.extend({
    render() {
      renderCalled++
      View.prototype.render.apply(this, arguments);
    }
  });

  new MyView({
    headerScroll: false
  }).render();

  app.me.hasAddon = true;

  t.equal(renderCalled, 2);
});
