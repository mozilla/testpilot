import tape from 'tape-catch';
import around from 'tape-around';
import app from 'ampersand-app';
import Me from '../../app/models/me';
import View from '../../app/views/error-page';

tape(`Running Tests for ${__filename}`, a => a.end());

const test = around(tape)
    .before(t => {
      app.me = new Me({
        user: {id: 'starman@rip'}
      });
      t.end();
    })
    .after(t => {
      app.reset();
      t.end();
    });

test('Error page view renders', t => {
  t.plan(1);
  const view = new View({headerScroll: false});
  view.render();
  t.ok(view.query('.full-page-wrapper'));
});
