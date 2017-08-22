// @flow

import type {
  Experiment,
  UpdateExperimentAction,
  SetSlugAction
} from '../reducers/experiments.js';

export function updateExperiment(addonID: string, data: Experiment): UpdateExperimentAction {
  return {
    type: 'UPDATE_EXPERIMENT',
    payload: { addonID, data }
  };
}

export function setSlug(slug: string): SetSlugAction {
  return {
    type: 'SET_SLUG',
    payload: slug
  };
}
