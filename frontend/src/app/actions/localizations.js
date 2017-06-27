// @flow

import type {
  Localizations,
  SetLocalizationsAction
} from '../reducers/localizations.js';

export function updateExperiment(addonID: string, data: Experiment): UpdateExperimentAction {
  return {
    type: 'UPDATE_EXPERIMENT',
    payload: { addonID, data }
  };
}

export function setLocalizations(localizations: Localizations): SetLocalizationsAction {
  return {
    type: 'SET_LOCALIZATIONS',
    payload: localizations
  };
}
