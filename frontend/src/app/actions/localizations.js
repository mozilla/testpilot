// @flow

import type {
  Localizations,
  SetLocalizationsAction
} from '../reducers/localizations.js';

export function setLocalizations(localizations: Localizations): SetLocalizationsAction {
  return {
    type: 'SET_LOCALIZATIONS',
    payload: localizations
  };
}
