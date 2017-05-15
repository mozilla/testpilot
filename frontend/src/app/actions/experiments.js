// @flow

import type {
  Experiment,
  UpdateExperimentAction,
  FetchUserCountsAction,
  SetSlugAction
} from '../reducers/experiments.js';

export function updateExperiment(addonID: string, data: Experiment): UpdateExperimentAction {
  return {
    type: 'UPDATE_EXPERIMENT',
    payload: { addonID, data }
  };
}

export function fetchUserCounts(countsUrl: string): Promise<FetchUserCountsAction> {
  return fetch(countsUrl)
    .then(
      response => {
        if (response.ok) {
          return response.json().then(data => ({
            type: 'FETCH_USER_COUNTS',
            payload: data
          }));
        }
        throw new Error('Could not get user counts');
      });
}

export function setSlug(slug: string): SetSlugAction {
  return {
    type: 'SET_SLUG',
    payload: slug
  };
}
