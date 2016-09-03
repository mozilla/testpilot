import test from 'tape-catch';
import app from 'ampersand-app';
import Experiment from '../../app/models/experiment';
import Me from '../../app/models/me';

test(`Running Tests for ${__filename}`, a => a.end());

test('enabled property is initialized as false by default', t => {
  t.plan(1);
  t.equal(new Experiment({title: 'test experiment 1'}).enabled, false);
});

test('install event sets enabled property', t => {
  t.plan(1);
  const model = new Experiment({id: 'rms@fsf.com',
                                title: 'test experiment 1'});

  app.trigger('addon-install:install-ended', {id: 'rms@fsf.com'});

  t.equal(model.enabled, true);
});

test('uninstall event unsets enabled property', t => {
  t.plan(1);
  const model = new Experiment({id: 'rms@fsf.com',
                                 title: 'test experiment 1',
                                 enabled: true});

  app.trigger('addon-uninstall:uninstall-ended', {id: 'rms@fsf.com'});

  t.equal(model.enabled, false);
});

// Issue #748
test('buildSurveyURL builds the expected survey URL', t => {
  t.plan(1);

  const model = new Experiment({
    title: 'SLSK',
    slug: 'slsk',
    addon_id: 'slsk@goog1e.net',
    url: '/slsk',
    survey_url: 'https://qsurvey.mozilla.com/s3/slsk'
  });

  app.me = new Me({
    user: {
      id: 'gary@busey.net'
    }
  });

  const expectedURL = model.survey_url +
    '?ref=givefeedback' +
    '&experiment=SLSK' +
    '&installed=slsk%40google.net' +
    '&installed=wheee%40mozilla.org';

  app.me.installed = {
    'slsk@google.net': {},
    'wheee@mozilla.org': {}
  };

  t.ok(model.buildSurveyURL('givefeedback') === expectedURL);
});
