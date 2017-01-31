/* global describe it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const reducers = proxyquire('../src/lib/reducers', {
  'sdk/util/uuid': { uuid: () => 'uuid', '@noCallThru': true, '@global': true },
  '../metrics/webextension-channels': { '@noCallThru': true, '@global': true }
}).default;

import * as actions from '../src/lib/actions';
import { Experiment } from '../src/lib/Experiment';
import { createStore } from 'redux';

const DEFAULT_STATE = {
  env: null,
  baseUrl: null,
  clientUUID: 'XXXX',
  notifications: { lastNotified: 1471935600000, nextCheck: 1471935600000 },
  ui: {},
  ratings: {},
  experiments: null,
  sideEffects: null
};

const X = new Experiment({ addon_id: 'X', created: '2017-01-01' });
const Y = new Experiment({ addon_id: 'Y', created: '2017-01-02' });

describe('reducers', function() {
  function testAction(action, initialState, expectedState) {
    const store = createStore(reducers, initialState);
    store.dispatch(action);
    const state = store.getState();
    delete state.sideEffects;
    delete expectedState.sideEffects;
    assert.deepEqual(state, expectedState, `${action.type} matched`);
  }

  it('handles EXPERIMENTS_LOADED', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, initialState, {
      baseUrl: 'testpilot.dev:8000',
      env: 'test',
      experiments: { X, Y }
    });
    const action = {
      type: actions.EXPERIMENTS_LOADED.type,
      payload: {
        envname: 'test',
        baseUrl: 'testpilot.dev:8000',
        experiments: { X, Y }
      }
    };
    testAction(action, initialState, expectedState);
    assert.ok(true);
  });

  it('handles INSTALL_ENDED', function() {
    const installDate = new Date();
    const initialState = Object.assign({}, DEFAULT_STATE, {
      experiments: { X, Y }
    });
    const expectedState = Object.assign({}, initialState, {
      experiments: { X: Object.assign({}, X, { active: true, installDate }), Y }
    });
    const action = {
      type: actions.INSTALL_ENDED.type,
      payload: { experiment: Object.assign({}, X, { installDate }) }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles EXPERIMENTS_LOAD_ERROR', function() {
    const initialState = Object.assign({}, DEFAULT_STATE, {
      experiments: { X, Y }
    });
    const expectedState = Object.assign({}, DEFAULT_STATE, { experiments: {} });
    const action = {
      type: actions.EXPERIMENTS_LOAD_ERROR.type,
      payload: { err: {} }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles EXPERIMENT_ENABLED', function() {
    const installDate = new Date();
    const initialState = Object.assign({}, DEFAULT_STATE, {
      experiments: { X, Y }
    });
    const expectedState = Object.assign({}, initialState, {
      experiments: { X: Object.assign({}, X, { active: true, installDate }), Y }
    });
    const action = {
      type: actions.EXPERIMENT_ENABLED.type,
      payload: { experiment: Object.assign({}, X, { installDate }) }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles EXPERIMENT_DISABLED', function() {
    const initialState = Object.assign({}, DEFAULT_STATE, {
      experiments: { X: Object.assign({}, X, { active: true }) }
    });
    const expectedState = Object.assign({}, initialState, {
      experiments: { X: Object.assign({}, X, { active: false }) }
    });
    const action = {
      type: actions.EXPERIMENT_DISABLED.type,
      payload: { experiment: X }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles EXPERIMENT_UNINSTALLING', function() {
    const initialState = Object.assign({}, DEFAULT_STATE, {
      experiments: { X: Object.assign({}, X, { active: true }) }
    });
    const expectedState = Object.assign({}, initialState, {
      experiments: { X: Object.assign({}, X, { active: false }) }
    });
    const action = {
      type: actions.EXPERIMENT_UNINSTALLING.type,
      payload: { experiment: X }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles SET_BADGE', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ui: Object.assign({}, DEFAULT_STATE.ui, { badge: 'Hey' })
    });
    const action = { type: actions.SET_BADGE.type, payload: { text: 'Hey' } };
    testAction(action, initialState, expectedState);
  });

  it('handles MAIN_BUTTON_CLICKED', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ui: Object.assign({}, DEFAULT_STATE.ui, { badge: null, clicked: 1 })
    });
    const action = {
      type: actions.MAIN_BUTTON_CLICKED.type,
      payload: { time: 1 }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles SCHEDULE_NOTIFIER', function() {
    const now = Date.now();
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      notifications: { lastNotified: now, nextCheck: now + 1 }
    });
    const action = {
      type: actions.SCHEDULE_NOTIFIER.type,
      payload: { lastNotified: now, nextCheck: now + 1 }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles SET_RATING', function() {
    const now = Date.now();
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ratings: { lastRated: now, X: { rating: 5 } }
    });
    const action = {
      type: actions.SET_RATING.type,
      payload: { time: now, rating: 5, experiment: X }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles SHOW_RATING_PROMPT', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ratings: { X: { '2': true } }
    });
    const action = {
      type: actions.SHOW_RATING_PROMPT.type,
      payload: { interval: 2, experiment: X }
    };
    testAction(action, initialState, expectedState);
  });

  it('handles INSTALL_EXPERIMENT', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = initialState;
    const action = { type: actions.INSTALL_EXPERIMENT.type, payload: {} };

    testAction(action, initialState, expectedState);
  });

  it('handles UNINSTALL_EXPERIMENT', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = initialState;
    const action = { type: actions.UNINSTALL_EXPERIMENT.type, payload: {} };

    testAction(action, initialState, expectedState);
  });

  it('handles UNINSTALL_SELF', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = initialState;
    const action = { type: actions.UNINSTALL_SELF.type, payload: {} };

    testAction(action, initialState, expectedState);
  });

  it('handles SELF_INSTALLED', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ui: { installTimestamp: 808 }
    });
    sinon.stub(Date, 'now').returns(808);
    const action = { type: actions.SELF_INSTALLED.type, payload: {} };

    testAction(action, initialState, expectedState);
    Date.now.restore();
  });

  it('handles SET_BASE_URL', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = initialState;
    const action = { type: actions.SET_BASE_URL.type, payload: {} };

    testAction(action, initialState, expectedState);
  });

  it('handles GET_INSTALLED', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = initialState;
    const action = { type: actions.GET_INSTALLED.type, payload: {} };

    testAction(action, initialState, expectedState);
  });

  it('handles SELF_UNINSTALLED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.SELF_UNINSTALLED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles INSTALL_FAILED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.INSTALL_FAILED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles INSTALL_STARTED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.INSTALL_STARTED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles INSTALL_CANCELLED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.INSTALL_CANCELLED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles DOWNLOAD_STARTED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.DOWNLOAD_STARTED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles DOWNLOAD_PROGRESS', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.DOWNLOAD_PROGRESS.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles DOWNLOAD_ENDED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.DOWNLOAD_ENDED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles DOWNLOAD_CANCELLED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.DOWNLOAD_CANCELLED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles DOWNLOAD_FAILED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.DOWNLOAD_FAILED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles LOAD_EXPERIMENTS', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.LOAD_EXPERIMENTS.type, payload: {} };
    // no change expected
    testAction(action, initialState, initialState);
  });

  it('handles INSTALL_STARTED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.INSTALL_STARTED.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles LOADING_EXPERIMENTS', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.LOADING_EXPERIMENTS.type,
      payload: { install: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles EXPERIMENT_UNINSTALLED', function() {
    const initialState = DEFAULT_STATE;
    const action = {
      type: actions.EXPERIMENT_UNINSTALLED.type,
      payload: { experiment: {} }
    };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles SELF_ENABLED', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.SELF_ENABLED.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles SELF_DISABLED', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.SELF_DISABLED.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles SYNC_INSTALLED', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.SYNC_INSTALLED.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles CHANGE_ENV', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.CHANGE_ENV.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles MAYBE_NOTIFY', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.MAYBE_NOTIFY.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles SHOW_NOTIFICATION', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.SHOW_NOTIFICATION.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles ADDONS_CHANGED', function() {
    const initialState = DEFAULT_STATE;
    const action = { type: actions.ADDONS_CHANGED.type, payload: {} };
    // Not implemented, no change expected
    testAction(action, initialState, initialState);
  });

  it('handles PROMPT_SHARE', function() {
    const initialState = DEFAULT_STATE;
    const expectedState = Object.assign({}, DEFAULT_STATE, {
      ui: { shareShown: true }
    });
    const action = { type: actions.PROMPT_SHARE.type, payload: {} };

    testAction(action, initialState, expectedState);
  });
});
