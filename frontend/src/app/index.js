import 'babel-polyfill/browser';
import 'l20n/dist/compat/web/l20n';
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import { compose, combineReducers, createStore, applyMiddleware } from 'redux';

import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import './lib/ga-snippet';

import { setupAddonConnection } from './lib/addon';
import config from './config';

import experimentsActions from './actions/experiments';
import experimentsReducer from './reducers/experiments';
import browserActions from './actions/browser';
import browserReducer from './reducers/browser';
import addonReducer from './reducers/addon';

import AppRouter from './lib/router';

es6Promise.polyfill();

const browserHistory = useRouterHistory(createHistory)({ basename: '/' });

const store = createStore(
  combineReducers({
    routing: routerReducer,
    experiments: experimentsReducer,
    browser: browserReducer,
    addon: addonReducer
  }),
  {},
  compose(
    applyMiddleware(
      thunk,
      promise,
      routerMiddleware(browserHistory),
      createLogger()
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const history = syncHistoryWithStore(browserHistory, store);
// HACK: On history change, scroll to the top.
history.listen(() => window.scroll(0, 0));

ReactDOM.render(
  <Provider store={store}>
    <AppRouter history={history} />
  </Provider>,
  document.querySelector('div[data-hook=page-container]')
);

// HACK: For debugging fun
window.store = store;

store.dispatch(experimentsActions.fetchExperiments(config.experimentsURL,
                                                   config.usageCountsURL));

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
store.dispatch(browserActions.setIsFirefox(isFirefox));

setupAddonConnection(store);
