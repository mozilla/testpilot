import test from 'tape-catch';
import app from 'ampersand-app';
import Me from '../../app/models/me';
import cookies from 'js-cookie';

test(`Running Tests for ${__filename}`, a => a.end());

test('hasAddon is set on addon installed event', t => {
  t.plan(1);

  const model = new Me();

  app.trigger('webChannel:addon-self:installed');

  t.equal(model.hasAddon, true);
});

test('hasAddon is unset on addon uninstalled event', t => {
  t.plan(1);
  const model = new Me();
  model.hasAddon = true;

  app.trigger('webChannel:addon-self:uninstalled');

  t.equal(model.hasAddon, false);
});

test('cookie csrftoken is set', t => {
  t.plan(1);
  const dummyToken = 'testtoken666';
  cookies.set('csrftoken', dummyToken);

  t.equal(new Me().csrfToken, dummyToken);
  cookies.remove('csrftoken');
});

test('updateEnabledExperiments updates all experiments if installed', t => {
  t.plan(1);
  const experiments = [{
    addon_id: 'rms@fsf.com'
  }, {
    addon_id: 'vincemcmahon@wwe.com'
  }];

  const model = new Me({installed: {
    'vincemcmahon@wwe.com': true,
    'rms@fsf.com': true
  }});

  model.updateEnabledExperiments(experiments);

  t.equal(experiments.map(e => e.enabled).length, 2);
});
