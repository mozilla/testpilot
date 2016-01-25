import test from 'tape-catch';
import View from '../../app/views/experiment-row-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Experiment row view renders', t => {
  t.plan(1);
  const view = new View().render();
  t.ok(view.query('.idea-card'));
});
