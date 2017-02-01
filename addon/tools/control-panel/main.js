/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global CustomEvent */

import React, { Component } from 'react';
import { render } from 'react-dom';
import * as actions from '../../src/lib/actions';
import templates from './templates';

window.addEventListener('addon-action', event => {
  // eslint-disable-next-line no-console
  console.log('from addon', event.detail);
});

function send(action) {
  document.documentElement.dispatchEvent(new CustomEvent('action', {
    bubbles: true,
    detail: action
  }));
}

function createAction(type) {
  const action = actions[type];
  return action(createPayload(action.args));
}

function createPayload(args) {
  const payload = {};
  args.forEach(a => {
    payload[a] = templates(a);
  });
  return payload;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { action: '{}' };
  }

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          send(JSON.parse(this.state.action));
        }}
      >
        <select
          size="24"
          onChange={e =>
            this.setState({
              action: JSON.stringify(createAction(e.target.value), null, 2)
            })}
        >
          {Object
            .keys(actions)
            .map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <textarea
          rows="24"
          cols="60"
          value={this.state.action}
          onChange={e => this.setState({ action: e.target.value })}
        />
        <input type="submit" value="send" />
      </form>
    );
  }
}

render(<App />, document.getElementById('root'));
