import test from 'tape-catch';
import View from '../../app/views/disable-dialog-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Disable Dialog view renders', t => {
  t.plan(1);

  const view = new View({id: 'enabled-feedback',
    experiment: 'blah/blah',
    title: 'Tell us what you think'
  });

  view.render();

  t.ok(view.query('.feedback-modal'));
});
