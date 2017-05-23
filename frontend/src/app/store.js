import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createLogger from 'redux-logger';
import promise from 'redux-promise';

import addonReducer from './reducers/addon';
import browserReducer from './reducers/browser';
import experimentsReducer from './reducers/experiments';
import newsletterFormReducer from './reducers/newsletter-form';
import varianttestsReducer from './reducers/varianttests';

import experiments from '../../build/api/experiments.json';

export const reducers = combineReducers({
  addon: addonReducer,
  browser: browserReducer,
  experiments: experimentsReducer,
  newsletterForm: newsletterFormReducer,
  varianttests: varianttestsReducer
});


export const initialState = {
  experiments: {
    data: experiments.results
  },
  addon: {
    // Null means we are being rendered at build time, and can't know
    // if the client will have the add on or not yet
    hasAddon: null,
    installed: {},
    installedLoaded: false,
    clientUUID: '',
    restart: {
      isRequired: false,
      forExperiment: null
    }
  }
};


export function createMiddleware() {
  return compose(
    applyMiddleware(
      promise,
      createLogger()
    ),
    (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : f => f
  );
}


export default function store() {
  return createStore(reducers, initialState, createMiddleware());
}
