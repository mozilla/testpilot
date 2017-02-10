/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import {
  activeCompletedExperimentList,
  activeExperiments,
  ratableExperiments
} from '../reducers/experiments';
import { experimentRating } from '../reducers/ratings';
import { setTimeout, clearTimeout } from 'sdk/timers';
import * as feedbackUI from '../feedbackUI';
import tabs from 'sdk/tabs';
import querystring from 'sdk/querystring';

import type { Experiment } from '../Experiment';
import type { Dispatch, GetState, ReduxStore } from 'testpilot/types';

const TEN_MINUTES = 1000 * 60 * 10;
const ONE_DAY = 1000 * 60 * 60 * 24;
const SHARE_DELAY = 3 * ONE_DAY;
const SHARE_PATH = '/share?utm_source=testpilot-addon&utm_medium=firefox-browser&utm_campaign=share-page';

function getInterval(installDate: ?Date) {
  installDate = installDate || new Date();
  const interval = Math.floor((Date.now() - installDate.getTime()) / ONE_DAY);
  if (interval < 2) {
    return 0;
  } else if (interval < 7) {
    return 2;
  } else if (interval < 21) {
    return 7;
  } else if (interval < 46) {
    return 21;
  } else {
    return 46;
  }
}

export default class FeedbackManager {
  dispatch: Dispatch;
  getState: GetState;
  dnd: number;
  timeout: ?number;
  constructor({ dispatch, getState }: ReduxStore) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.dnd = ONE_DAY;
    this.timeout = null;
  }

  schedule({ delay = TEN_MINUTES }: { delay: number } = {}) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.check();
      },
      delay
    );
  }

  check() {
    const state = this.getState();
    if (this.checkForCompletedExperimentSurveys()) {
      return;
    }
    if (Date.now() - (state.ratings.lastRated || 0) < this.dnd) {
      return;
    }
    const experiments = ratableExperiments(state);
    const experiment = experiments[
      Math.floor(Math.random() * experiments.length)
    ];
    if (!experiment) {
      return;
    }
    const rating = experimentRating(state, experiment.addon_id);
    const interval = getInterval(experiment.installDate);
    if (interval > 0 && !rating[interval]) {
      this.dispatch(actions.SHOW_RATING_PROMPT({ interval, experiment }));
    }
  }

  checkForCompletedExperimentSurveys() {
    const state = this.getState();
    const eligibles = activeCompletedExperimentList(state).filter(x => {
      const r = experimentRating(state, x.id);
      return !r || !r['eol'];
    });
    if (eligibles.length > 0) {
      const experiment = eligibles[
        Math.floor(Math.random() * eligibles.length)
      ];
      if (experiment) {
        tabs.once('open', () => {
          setTimeout(
            () => this.promptRating({ interval: 'eol', experiment }),
            1000
          );
        });
        return true;
      }
    }
    return false;
  }

  maybeShare() {
    const { ui, baseUrl } = this.getState();
    if (!ui.shareShown && ui.installTimestamp + SHARE_DELAY < Date.now()) {
      this.dispatch(actions.PROMPT_SHARE({ url: baseUrl + SHARE_PATH }));
    }
  }

  promptShare(url: string) {
    return feedbackUI.showSharePrompt(url);
  }

  promptRating(
    {
      interval,
      experiment
    }: { interval: number | string, experiment: Experiment }
  ) {
    return feedbackUI
      .showRating({ interval, experiment, persistence: 10 })
      .then(rating => {
        if (!rating) {
          return Promise.resolve();
        }
        this.dispatch(
          actions.SET_RATING({ experiment, rating, time: Date.now() })
        );
        return feedbackUI.showSurveyButton({ experiment }).then(clicked => {
          if (clicked) {
            const state = this.getState();
            const urlParams = querystring.stringify({
              id: experiment.addon_id,
              cid: state.clientUUID,
              installed: Object.keys(activeExperiments(state)),
              rating,
              interval
            });
            tabs.open(`${experiment.survey_url}?${urlParams}`);
          }
        });
      })
      .catch(() => {});
  }
}
