import { routerReducer, routerMiddleware } from 'react-router-redux';
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
  routing: routerReducer,
  varianttests: varianttestsReducer
});


export const initialState = {
  experiments: {
    data: experiments.results
  },
  addon: {
    hasAddon: !!window.navigator.testpilotAddon,
    installed: {},
    installedLoaded: false,
    clientUUID: '',
    restart: {
      isRequired: false,
      forExperiment: null
    }
  }
};


export const createMiddleware = history => compose(
  applyMiddleware(
    promise,
    routerMiddleware(history),
    createLogger()
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);


export default function store(history) {
  return createStore(reducers, initialState, createMiddleware(history));
}
