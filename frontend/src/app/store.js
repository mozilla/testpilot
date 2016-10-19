import { routerReducer, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createLogger from 'redux-logger';
import promise from 'redux-promise';
import thunk from 'redux-thunk';

import addonReducer from './reducers/addon';
import experimentsReducer from './reducers/experiments';
import browserReducer from './reducers/browser';


export const reducers = combineReducers({
  addon: addonReducer,
  browser: browserReducer,
  experiments: experimentsReducer,
  form: formReducer,
  routing: routerReducer
});


export const initialState = {
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
    thunk,
    promise,
    routerMiddleware(history),
    createLogger()
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);


export default function store(history) {
  return createStore(reducers, initialState, createMiddleware(history));
}
