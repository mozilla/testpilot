import { createActions } from 'redux-actions';

export default createActions(
  {},
  'setHasAddon', 'setInstalled', 'setClientUuid',
  'enableExperiment', 'disableExperiment',
  'requireRestart'
);
