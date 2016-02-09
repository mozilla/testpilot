import test from 'tape-catch';
import View from '../../app/views/feedback-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Feedback view renders', t => {
  t.plan(1);

  const view = new View({id: 'enabled-feedback',
    experiment: 'blah/blah',
    title: 'Tell us what you think',
    questions: [
        { value: 'broken', title: 'Something seems broken.' },
        { value: 'feature', title: 'Request a feature.' },
        { value: 'cool', title: 'This is cool!' },
        { value: 'other', title: 'Something else.' }
    ]
  });

  view.render();

  t.ok(view.query('.feedback-modal'));
});
