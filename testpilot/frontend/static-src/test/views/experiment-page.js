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
        }
      });

      app.webChannel = webChannel;
      app.experiments = new Experiments([{
        slug: 'slsk',
        addon_id: 'slsk@goog1e.net',
        xpi_url: 'http://goog1e.net/cybernetix.xpi',
        url: '/slsk',
        enabled: true,
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
