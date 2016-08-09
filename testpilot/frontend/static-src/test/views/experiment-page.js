import tape from 'tape-catch';
import around from 'tape-around';
import View from '../../app/views/experiment-page';
import app from 'ampersand-app';
import webChannel from '../../app/lib/web-channel.js';
import Me from '../../app/models/me';
import Experiments from '../../app/collections/experiments';
const MyView = View.extend({headerScroll: false});

tape(`Running Tests for ${__filename}`, a => a.end());

const test = around(tape)
    .before(t => {
      app.me = new Me({
        user: {
          id: 'gary@busey.net'
        },
        installed: {
          'slsk@google.net': {},
          'wheee@mozilla.org': {}
        }
      });
      app.sendToGA = () => {};

      app.webChannel = webChannel;
      app.experiments = new Experiments([{
        title: 'SLSK',
        slug: 'slsk',
        addon_id: 'slsk@goog1e.net',
        xpi_url: 'http://goog1e.net/cybernetix.xpi',
        url: '/slsk',
        enabled: true,
        introduction: '<h1>Hello introduction!</h1>',
        installation_count: 123456,
        details: [{
          image: 'img/fail.png',
          copy: 'blah',
          headline: 'bogus headline'
        }],
        contributors: [{
          avatar: 'img/fail.png',
          'display_name': 'Angela Davis',
          title: 'Activist'
        }]
      }]);
      t.end();
    })
    .after(t => {
      app.reset();
      t.end();
    });

test('Experiment Page view renders', t => {
  t.plan(2);
  const myView = new MyView({headerScroll: false, slug: 'slsk'});

  app.me.hasAddon = true;
  myView.render();
  t.ok(myView.query('.details-header'), 'Page renders when user has add-on');

  app.me.hasAddon = false;
  myView.render();
  t.ok(myView.query('.details-header'),
       'Page renders when user does not have add-on');
});

test('afterRender attaches detailView and contributorView', t => {
  t.plan(2);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();

  t.ok(myView.query('.details-description'));
  t.ok(myView.query('.contributors'));
});

test('indicator bar shows when experiment is enabled', t => {
  t.plan(4);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();

  const model = app.experiments.get('slsk', 'slug');

  model.enabled = true;

  t.ok(myView.query('.details-header-wrapper.has-status'));
  t.ok(myView.query('.status-bar.enabled'));

  model.enabled = false;
  // since the display logic is in CSS,
  // check for the selector pattern that would
  // show the notification
  t.equal(myView.query('.details-header-wrapper.has-status'), undefined);
  t.equal(myView.query('.status-bar.enabled'), undefined);
});

test('indicator bar shows when an error occurred', t => {
  t.plan(4);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();

  const model = app.experiments.get('slsk', 'slug');
  model.enabled = false;

  model.error = true;

  t.ok(myView.query('.details-header-wrapper.has-status'));
  t.ok(myView.query('.status-bar.error'));

  model.error = false;
  // since the display logic is in CSS,
  // check for the selector pattern that would
  // show the notification
  t.equal(myView.query('.details-header-wrapper.has-status'), undefined);
  t.equal(myView.query('.status-bar.error'), undefined);
});

test('introduction in sidebar for users without add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const model = app.experiments.models[0];
  app.me.hasAddon = false;
  const container = '.details-sections [data-hook="introduction-container"]';
  const html = '.details-sections [data-hook="introduction-html"]';

  view.render();
  t.ok(view.query(html).innerHTML === model.introduction,
       'Introduction present in DOM when truthy.');

  model.introduction = '';
  view.render();
  t.ok(view.query(container).style.visibility === 'hidden',
       'Introduction is not visible when falsy.');
});

test('introduction in main content for users with add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const model = app.experiments.models[0];
  const container = '.details-content [data-hook="introduction-container"]';
  const html = '.details-content [data-hook="introduction-html"]';

  view.render();
  t.ok(view.query(html).innerHTML === model.introduction,
       'Introduction present in DOM when truthy.');

  model.introduction = '';
  view.render();
  t.ok(view.query(container).style.visibility === 'hidden',
       'Introduction is not visible when falsy.');
});

test('stats only shown to users with add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const stats = '.stats';

  app.me.hasAddon = true;
  view.render();
  t.notOk('style' in view.query(stats).parentNode.attributes,
          'Stats are not hidden when add-on is installed.');

  app.me.hasAddon = false;
  view.render();
  t.ok(view.query(stats).parentNode.style.display === 'none',
       'Stats are hidden when add-on is not installed.');
});

test('measurements and privacy policy only shown to users with add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const measurements = '[data-hook="measurements-container"]';

  app.me.hasAddon = true;
  view.render();
  t.notOk('style' in view.query(measurements).parentNode.attributes,
          'Measurements are not hidden when add-on is installed.');

  app.me.hasAddon = false;
  view.render();
  t.ok(view.query(measurements).parentNode.style.display === 'none',
       'Measurements are hidden when add-on is not installed.');
});

test('Test Pilot promo only shown to users without add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const promo = '[data-hook="testpilot-promo"]';

  app.me.hasAddon = false;
  view.render();
  t.ok(view.query(promo).childNodes.length === 1,
       'Promo shown when add-on is not installed.');

  app.me.hasAddon = true;
  view.render();
  t.ok(view.query(promo).childNodes.length === 0,
       'Promo not shown when add-on is installed.');
});

test('experiment list only shown to users without add-on', t => {
  t.plan(2);

  const view = new MyView({headerScroll: false, slug: 'slsk'});
  const experimentList = '[data-hook="experiment-list"]';

  app.me.hasAddon = false;
  view.render();
  t.notOk('style' in view.query(experimentList).parentNode.attributes,
          'Experiment list not hidden when add-on is not installed.');

  app.me.hasAddon = true;
  view.render();
  t.ok(view.query(experimentList).parentNode.style.display === 'none',
       'Experiment list hidden when add-on is installed.');
});

test('experiment list excludes current experiment', t => {
  t.plan(1);
  const view = new MyView({headerScroll: false, slug: 'slsk'});
  app.me.hasAddon = false;
  view.render();
  t.ok(view.queryAll('.experiment-summary').length === 0,
       'Current experiment excluded from experiment list.');
});

test('updateAddon tests', t => {
  t.plan(3);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  const myModel = app.experiments.models[0];

  document.addEventListener('from-web-to-addon', evt => {
    if (evt.detail.type === 'install-experiment') {
      t.ok(evt, 'calls install correctly');
      t.ok(evt.detail.data.xpi_url, 'forwards event correctly');
      myView.updateAddon(false, myModel);
    }

    if (evt.detail.type === 'uninstall-experiment') {
      t.ok(evt, 'calls uninstall correctly');
    }
  });

  myView.updateAddon(true, myModel);
});

test('installation count gets commafied', t => {
  t.plan(1);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});

  myView.render();
  const installCount = myView.query('[data-hook=install-count]').textContent;
  t.ok(installCount.indexOf(',') > -1);
});

// TODO: #1138 Fix hacky test for Wayback machine subtitle rendering
test('subtitle renders correctly', t => {
  t.plan(2);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  const model = app.experiments.get('slsk', 'slug');

  myView.render();

  let subtitle = myView.query('[data-hook=subtitle]').textContent;

  t.ok(subtitle === '');


  model.title = 'No More 404s';
  myView.render();
  subtitle = myView.query('[data-hook=subtitle]').textContent;
  t.ok(subtitle === 'Powered by the Wayback Machine');
});

// Issue #748
test('feedback button uses the expected survey URL', t => {
  t.plan(1);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});

  const myModel = app.experiments.models[0];
  myModel.survey_url = 'https://qsurvey.mozilla.com/s3/slsk';

  const expectedURL = myModel.survey_url +
    '?ref=givefeedback' +
    '&experiment=SLSK' +
    '&installed=slsk%40google.net' +
    '&installed=wheee%40mozilla.org';

  myView.render();

  t.ok(myView.query('[data-hook=feedback]').href === expectedURL);
});
