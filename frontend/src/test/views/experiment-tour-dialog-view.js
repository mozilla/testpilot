import test from 'tape-catch';
import Experiment from '../../app/models/experiment';
import View from '../../app/views/experiment-tour-dialog-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Experiment tour dialog view renders', t => {
  const model = new Experiment({
    slug: 'test',
    title: 'test',
    tour_steps: [
      {copy: 'step 1', image: '1.gif'},
      {copy: 'step 2', image: '2.gif'},
      {copy: 'step 3', image: '3.gif'}
    ]
  });

  const view = new View({
    model: model
  });

  view.render();

  t.plan(66);

  t.ok(view.query('.onboarding-modal'), 'view rendered ok');

  const content = view.queryAll('.tour-content');
  t.equal(content.length, 3, 'correct number of tour steps rendered');

  content.forEach((el, idx) => {
    const expected = model.tour_steps[idx];
    t.equal(el.querySelector('.tour-text').innerHTML, expected.copy,
            'copy for #' + idx + ' is correct');
    t.equal(el.querySelector('.tour-image img').getAttribute('src'), expected.image,
            'image for #' + idx + ' is correct');
  });

  const expectedStepStates = [
    [
      ['.onboarding-modal', 'no-display', false],
      ['.tour-modal', 'no-display', true]
    ], [
      ['.onboarding-modal', 'no-display', true],
      ['.tour-modal', 'no-display', false],
      ['.tour-back', 'hidden', true],
      ['.tour-next', 'no-display', false],
      ['[data-hook=cancel-modal-done]', 'no-display', true],
      ['.tour-content:nth-of-type(1)', 'no-display', false],
      ['.tour-content:nth-of-type(2)', 'no-display', true],
      ['.tour-content:nth-of-type(3)', 'no-display', true]
    ], [
      ['.onboarding-modal', 'no-display', true],
      ['.tour-modal', 'no-display', false],
      ['.tour-back', 'hidden', false],
      ['.tour-next', 'no-display', false],
      ['[data-hook=cancel-modal-done]', 'no-display', true],
      ['.tour-content:nth-of-type(1)', 'no-display', true],
      ['.tour-content:nth-of-type(2)', 'no-display', false],
      ['.tour-content:nth-of-type(3)', 'no-display', true]
    ], [
      ['.onboarding-modal', 'no-display', true],
      ['.tour-modal', 'no-display', false],
      ['.tour-back', 'no-display', true],
      ['.tour-next', 'no-display', true],
      ['[data-hook=cancel-modal-done]', 'no-display', false],
      ['.tour-content:nth-of-type(1)', 'no-display', true],
      ['.tour-content:nth-of-type(2)', 'no-display', true],
      ['.tour-content:nth-of-type(3)', 'no-display', false]
    ]
  ];

  expectedStepStates.forEach((states, idx) => {
    t.equal(idx - 1, view.currentStep,
            'current step should be ' + (idx - 1));
    states.forEach(state => {
      const [selector, className, expected] = state;
      t.equal(view.query(selector).classList.contains(className), expected,
              selector + ' class ' + className + ' expected? ' + expected);
    });
    if (idx === 0) {
      view.takeTour();
    } else {
      view.tourNext();
    }
  });

  expectedStepStates.reverse();

  expectedStepStates.forEach((states, revIdx) => {
    const idx = expectedStepStates.length - revIdx - 1;
    if (idx === 0) { return; }  // Cannot step back to intro
    t.equal(idx - 1, view.currentStep,
            'current step should be ' + (idx - 1));
    states.forEach(state => {
      const [selector, className, expected] = state;
      t.equal(view.query(selector).classList.contains(className), expected,
              selector + ' class ' + className + ' expected? ' + expected);
    });
    view.tourBack();
  });

  let removeCalled = 0;
  view.remove = () => removeCalled++;
  view.cancel();
  t.equal(1, removeCalled,
          'cancel() should remove subview');
});
