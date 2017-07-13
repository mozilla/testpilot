// @flow

export type Localizations = {
  [language: string]: string
};

function defaultState(): Localizations {
  return {
  };
}

export type SetLocalizationsAction = {
  type: 'SET_LOCALIZATIONS',
  payload: Localizations
};

function setLocalizations(
  state: Localizations,
  action: SetLocalizationsAction
): Localizations {
  return action.payload;
}

export default function localizationsReducer(
  state: ?Localizations,
  action: SetLocalizationsAction
): Localizations {
  if (!state) {
    return defaultState();
  }
  switch (action.type) {
    case 'SET_LOCALIZATIONS':
      return setLocalizations(state, action);
    default:
      return state;
  }
}
