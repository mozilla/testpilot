import { createActions } from 'redux-actions';

export default createActions(
  {
    setInstalled: installed => ({
      installed: installed || {},
      installedLoaded: !!installed
    })
  },
  'setHasAddon', 'setClientUuid',
  'enableExperiment', 'disableExperiment',
  'requireRestart'
);
