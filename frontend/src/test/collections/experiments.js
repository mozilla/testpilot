import test from 'tape-catch';
import app from 'ampersand-app';
import Experiments from '../../app/collections/experiments';

test(`Running Tests for ${__filename}`, a => a.end());

test('addon-uninstalled event unsets enabled for each experiment', t => {
  t.plan(1);
  const experiments = new Experiments([
    {title: 'test experiment 1', enabled: true},
    {title: 'test experiment 2', enabled: true}
  ]);

  app.trigger('webChannel:addon-self:uninstalled');

  t.equal(experiments.models.map(e => e.enabled === false).length, 2);
});
