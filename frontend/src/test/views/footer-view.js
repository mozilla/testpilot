import test from 'tape-catch';
import View from '../../app/views/footer-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Footer view renders', t => {
  t.plan(1);
  const view = new View().render();
  t.ok(view.query('#footer-links'));
});
