import test from 'tape-catch';
import Experiment from '../../app/models/experiment';
import View from '../../app/views/experiment-row-view';

const NOW = Date.now();
const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;
const THREE_DAYS = 3 * ONE_DAY;

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

// TODO: #1138 Fix hacky test for Wayback machine subtitle rendering
test('subtitle on cards renders correctly', t => {
  t.plan(2);

  const model = new Experiment({
    slug: 'test',
    short_title: '',
    title: 'long long long title'
  });
  const view = new View({model: model}).render();
  let subtitle = view.query('[data-hook=subtitle]').textContent;

  t.ok(subtitle === '');

  model.title = 'No More 404s';
  view.render();
  subtitle = view.query('[data-hook=subtitle]').textContent;

  t.ok(subtitle === 'Powered by the Wayback Machine');
});

test('Experiment row card displays "Just Launched" when experiment is new & unseen', t => {
  t.plan(4);
  const model = new Experiment({
    slug: 'test',
    title: 'long long long title',
    created: NOW - TWO_DAYS
  });
  model.lastSeen = null;

  const view = new View({model: model}).render();
  t.ok(view.query('.experiment-summary.just-launched'),
       'should appear when unseen');

  model.enabled = true;
  view.render();
  t.ok(!view.query('.experiment-summary.just-launched'),
       'should not appear when enabled');

  model.enabled = false;
  model.lastSeen = NOW;
  view.render();
  t.ok(!view.query('.experiment-summary.just-launched'),
       'should not appear after seen');

  model.lastSeen = null;
  model.created = ONE_DAY * 30;
  view.render();
  t.ok(!view.query('.experiment-summary.just-launched'),
       'should not appear when too old');
});

test('Experiment row card displays "Just Updated" when experiment is updated since last seen', t => {
  t.plan(4);
  const model = new Experiment({
    slug: 'test',
    title: 'long long long title',
    created: NOW - TWO_DAYS,
    modified: NOW - ONE_DAY
  });
  model.lastSeen = NOW - THREE_DAYS;

  const view = new View({model: model}).render();
  t.ok(view.query('.experiment-summary.just-updated'),
       'should appear when modified after last seen');

  model.enabled = true;
  view.render();
  t.ok(!view.query('.experiment-summary.just-updated'),
       'should not appear when enabled');

  model.enabled = false;
  model.lastSeen = NOW;
  view.render();
  t.ok(!view.query('.experiment-summary.just-updated'),
       'should not appear when seen since modified');

  model.lastSeen = NOW - THREE_DAYS;
  model.modified = NOW - ONE_DAY * 30;
  view.render();
  t.ok(!view.query('.experiment-summary.just-updated'),
       'should not appear when too old');
});

test('Experiment card shows "Ending Soon" when experiment is nearly completed', t => {
  t.plan(2);
  const model = new Experiment({
    slug: 'test',
    title: 'just a test',
    created: NOW - THREE_DAYS,
    completed: NOW + THREE_DAYS
  });

  const view = new View({model: model});
  view.render();
  t.equal(view.query('.eol-message').innerHTML, 'Ending Soon');

  model.completed = NOW + ONE_DAY;
  view.render();
  t.equal(view.query('.eol-message').innerHTML, 'Ending Tomorrow');
});

test('Experiment card does not show an EOL message with no completed date', t => {
  t.plan(1);
  const model = new Experiment({
    slug: 'test',
    title: 'just a test',
    created: NOW - THREE_DAYS
  });

  const view = new View({model: model}).render();
  t.equal(view.query('.eol-message').innerHTML, '');
});
