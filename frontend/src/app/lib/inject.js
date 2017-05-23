import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { setupAddonConnection } from './InstallManager';
import store from '../store';
import App from '../containers/App';

export default function inject(name, component, callback) {
  const s = store();
  if (callback !== undefined) {
    callback(s);
  }
  const provider = <Provider store={ s }>
    <App>{ component }</App>
  </Provider>;

  if (typeof document !== 'undefined') {
    setupAddonConnection(s);
    if (document.body !== null) {
      let node = document.getElementById('page-container');
      if (node === null) {
        node = document.createElement('div');
        node.id = 'page-container';
        document.body.appendChild(node);
      }
      ReactDOM.render(provider, node);
    }
  }
  return provider;
}
