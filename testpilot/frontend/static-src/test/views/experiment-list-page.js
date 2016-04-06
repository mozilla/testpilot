import tape from 'tape-catch';
import around from 'tape-around';
import View from '../../app/views/experiment-list-page';
import app from 'ampersand-app';
import Me from '../../app/models/me';
import Experiments from '../../app/collections/experiments';

tape(`Running Tests for ${__filename}`, a => a.end());

const test = around(tape)
    .before(t => {
      app.me = new Me({
        user: {id: 'PattiSmith'}
      });
      app.sendToGA = () => {};
      t.end();
    })
    .after(t => {
      app.reset();
      t.end();
    });

test('Experiment List Page view renders', t => {
  t.plan(1);
  app.experiments = new Experiments();
  const view = new View({headerScroll: false});
  view.render();
  t.ok(view.query('.intro-text'));
});

test('Experiment List view is present after render', t => {
  t.plan(1);

  app.experiments = new Experiments([{
    slug: 'slsk',
    enabled: true
  }]);

  const view = new View({headerScroll: false});
  view.render();
  t.ok(view.query('.responsive-content-wrapper li'));
});
