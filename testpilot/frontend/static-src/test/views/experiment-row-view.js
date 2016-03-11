import test from 'tape-catch';
import Experiment from '../../app/models/experiment';
import View from '../../app/views/experiment-row-view';

test(`Running Tests for ${__filename}`, a => a.end());

test('Experiment row view renders', t => {
  t.plan(1);
  const model = new Experiment({
    slug: 'test',
    title: 'test'
  });
  const view = new View({model: model}).render();
  t.ok(view.query('.experiment-summary'));
});

test('Experiment row displays title when short_title is blank', t => {
  t.plan(1);
  const expectedTitle = 'long title';
  const model = new Experiment({
    slug: 'test',
    short_title: '',
    title: expectedTitle
  });
  const view = new View({model: model}).render();
  t.equal(view.query('.experiment-summary h3').innerHTML, expectedTitle);
});

test('Experiment row displays short_title', t => {
  t.plan(1);
  const expectedTitle = 'short title';
  const model = new Experiment({
    slug: 'test',
    short_title: expectedTitle,
    title: 'long long long title'
  });
  const view = new View({model: model}).render();
  t.equal(view.query('.experiment-summary h3').innerHTML, expectedTitle);
});
