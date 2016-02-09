import test from 'tape-catch';
import View from '../../app/views/account-inactive-page';

test(`Running Tests for ${__filename}`, a => a.end());

test('Account inactive view renders', t => {
  t.plan(1);
  const view = new View();
  view.render();
  t.ok(view.query('.main-content'));
});
