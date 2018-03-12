// @flow

import type {
  Experiment,
  UpdateExperimentAction
} from "../reducers/experiments.js";

export function updateExperiment(addonID: string, data: Experiment): UpdateExperimentAction {
  return {
    type: "UPDATE_EXPERIMENT",
    payload: { addonID, data }
  };
}
