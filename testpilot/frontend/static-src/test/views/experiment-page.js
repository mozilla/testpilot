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
  t.plan(1);
  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();
  t.ok(myView.query('.details-header'));
});

test('afterRender attaches detailView and contributorView', t => {
  t.plan(2);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();

  t.ok(myView.query('.details-description'));
  t.ok(myView.query('.contributors'));
});

test('now active indicator shows when experiment is enabled', t => {
  t.plan(2);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  myView.render();

  t.ok(myView.query('.now-active'));
  const model = app.experiments.get('slsk', 'slug');
  model.enabled = false;
  t.equal(myView.query('.now-active').style.display, 'none');
});

test('introduction appears in view', t => {
  t.plan(3);

  const myView = new MyView({headerScroll: false, slug: 'slsk'});
  const myModel = app.experiments.models[0];

  myView.render();
  const innerHTML = myView.query('[data-hook=introduction-html]').innerHTML;
  const styleWhenNotEmpty = myView
    .query('[data-hook=introduction-container]').style;
  t.ok(innerHTML === myModel.introduction,
       'innerHTML matches model');
  t.ok(styleWhenNotEmpty.visibility !== 'hidden',
       'introduction is visible when model has content');

  myModel.introduction = '';
  myView.render();
  const styleWhenEmpty = myView
    .query('[data-hook=introduction-container]').style;
  t.ok(styleWhenEmpty.visibility === 'hidden',
       'introduction is hidden when model has no content');
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
