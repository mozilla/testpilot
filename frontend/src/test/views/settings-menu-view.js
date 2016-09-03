import test from 'tape-catch';
import View from '../../app/views/settings-menu-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Settings Menu view renders', t => {
  t.plan(1);
  const view = new View();
  view.render();
  t.ok(view.query('.settings-contain'));
});
