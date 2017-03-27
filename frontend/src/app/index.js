import 'babel-polyfill/browser';
import 'l20n/dist/compat/web/l20n';
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

import Raven from 'raven-js';

import React from 'react';
import ReactDOM from 'react-dom';

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import './lib/ga-snippet';

import { setupAddonConnection } from './lib/addon';
import createStore from './store';
import config from './config';

import experimentsActions from './actions/experiments';
import addonActions from './actions/addon';
import Routes from './components/Routes';

es6Promise.polyfill();

Raven.config(config.ravenPublicDSN).install();

const browserHistory = useRouterHistory(createHistory)({ basename: '/' });

const store = createStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);
// HACK: On history change, scroll to the top.
history.listen(() => window.scroll(0, 0));

ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.querySelector('div#page-container')
);

// HACK: For debugging fun
window.store = store;

store.dispatch(experimentsActions.fetchUserCounts(config.usageCountsURL));

setupAddonConnection(store);

window.setTimeout(() => {
  if (store.getState().addon.hasAddon === null) {
    store.dispatch(addonActions.setHasAddon(false));
  }
}, 500);
