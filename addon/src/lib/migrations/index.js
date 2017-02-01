/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import typeof { storage } from 'sdk/simple-storage';

export function migrate(store: storage): Object {
  if (store.root) {
    // we're >= v1.0.0
    return Object.assign({}, store.root);
  }
  if (store.clientUUID) {
    // we're < v1.0
    return v0tov1(store);
  }
  // hi, we're new here
  return {};
}

function v0tov1(store: storage) {
  const root = {};
  root.clientUUID = store.clientUUID;
  if (store.surveyChecks) {
    root.ratings = convertSurveys(store.surveyChecks);
  }
  if (store.sharePrompt && store.sharePrompt.hasBeenShown) {
    root.ui = { shareShown: true };
  }
  return root;
}

const surveyIntervals = {
  twoDaysSent: 2,
  oneWeekSent: 7,
  threeWeeksSent: 21,
  monthAndAHalfSent: 46,
  eol: 'eol'
};

function convertSurveys(checks: Object) {
  const ratings = {};
  Object.keys(surveyIntervals).forEach(name => {
    const survey = checks[name];
    if (survey) {
      Object.keys(survey).forEach(id => {
        const addon = ratings[id] || {};
        // we didn't track this before
        addon.rating = -1;
        addon[surveyIntervals[name]] = true;
        ratings[id] = addon;
      });
    }
  });
  if (Object.keys(ratings).length > 0) {
    // we don't know when they last rated, but they have at least once
    // so we'll use now as a start for the do-not-disturb timer
    ratings.lastRated = Date.now();
  }
  return ratings;
}
