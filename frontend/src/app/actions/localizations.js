// @flow

import type {
  Localizations,
  NegotiatedLanguages
} from "../reducers/localizations.js";

export type SetLocalizationsAction = {
  type: 'SET_LOCALIZATIONS',
  payload: Localizations
};

export type SetNegotiatedLanguagesAction = {
  type: 'SET_NEGOTIATED_LANGUAGES',
  payload: NegotiatedLanguages
};

export type LocalizationsAction = SetLocalizationsAction | SetNegotiatedLanguagesAction;

export function setLocalizations(
  localizations: Localizations
): SetLocalizationsAction {
  return {
    type: "SET_LOCALIZATIONS",
    payload: localizations
  };
}

export function setNegotiatedLanguages(
  negotiatedLanguages: NegotiatedLanguages
): SetNegotiatedLanguagesAction {
  return {
    type: "SET_NEGOTIATED_LANGUAGES",
    payload: negotiatedLanguages
  };
}
