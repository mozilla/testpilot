// @flow

import type {
  InstalledExperiments,
  SetInstalledAction
} from '../reducers/addon';

function makeSimpleActionCreator<T>(type: string) {
  return (payload: T): { type: string, payload: T } => ({ type, payload });
}

function setInstalled(installed: InstalledExperiments): SetInstalledAction {
  return {
    type: 'SET_INSTALLED',
    payload: {
      installed,
      installedLoaded: !!installed
    }
  };
}

export default {
  setInstalled,
  setHasAddon: makeSimpleActionCreator('SET_HAS_ADDON'),
  setClientUuid: makeSimpleActionCreator('SET_CLIENT_UUID'),
  setInstalledAddons: makeSimpleActionCreator('SET_INSTALLED_ADDONS'),
  manuallyEnableExperiment: makeSimpleActionCreator('MANUALLY_ENABLE_EXPERIMENT'),
  manuallyDisableExperiment: makeSimpleActionCreator('MANUALLY_DISABLE_EXPERIMENT'),
  enableExperiment: makeSimpleActionCreator('ENABLE_EXPERIMENT'),
  disableExperiment: makeSimpleActionCreator('DISABLE_EXPERIMENT'),
  requireRestart: makeSimpleActionCreator('REQUIRE_RESTART')
};
