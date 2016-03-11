import test from 'tape-catch';
import View from '../../app/views/not-found-page';

test(`Running Tests for ${__filename}`, a => a.end());

test('Not Found Page view renders', t => {
  t.plan(1);
  const view = new View();
  view.render();
  t.ok(view.query('#full-page-wrapper'));
});
