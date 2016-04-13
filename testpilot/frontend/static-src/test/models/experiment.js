import test from 'tape-catch';
import app from 'ampersand-app';
import Experiment from '../../app/models/experiment';

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
