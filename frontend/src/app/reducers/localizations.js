// @flow

import type {
  SetLocalizationsAction,
  SetNegotiatedLanguagesAction,
  LocalizationsAction
} from "../actions/localizations";

export type Localizations = {
  [language: string]: string
};

export type NegotiatedLanguages = Array<string>;

export type LocalizationsState = {
  localizations: Localizations,
  negotiatedLanguages: NegotiatedLanguages
};

function defaultState(): LocalizationsState {
  return {
    localizations: {},
    negotiatedLanguages: []
  };
}

function setLocalizations(
  state: LocalizationsState,
  action: SetLocalizationsAction
): LocalizationsState {
  return { ...state, localizations: action.payload };
}

function setNegotiatedLanguages(
  state: LocalizationsState,
  action: SetNegotiatedLanguagesAction
): LocalizationsState {
  return { ...state, negotiatedLanguages: action.payload };
}

export default function localizationsReducer(
  state: ?LocalizationsState,
  action: LocalizationsAction
): LocalizationsState {
  if (!state) {
    return defaultState();
  }
  switch (action.type) {
    case "SET_NEGOTIATED_LANGUAGES":
      return setNegotiatedLanguages(state, action);
    case "SET_LOCALIZATIONS":
      return setLocalizations(state, action);
    default:
      return state;
  }
}
