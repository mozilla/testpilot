// @flow

export type Experiment = {
  addon_id: string,
  completed: string,
  slug: string,
  xpi_url: string,
  inProgress: boolean,
};

export type ExperimentsState = {
  data: Array<Experiment>
};

function defaultState(): ExperimentsState {
  return {
    data: []
  };
}

export type UpdateExperimentAction = {
  type: "UPDATE_EXPERIMENT",
  payload: {
    addonID: string,
    data: Experiment
  }
};

type ExperimentsActions = UpdateExperimentAction;


function updateExperiment(
  state: ExperimentsState,
  { payload: { addonID, data } }: UpdateExperimentAction
): ExperimentsState {
  return {
    ...state,
    data: state.data.map(experiment =>
      ((experiment.addon_id !== addonID) ?  experiment : { ...experiment, ...data }))
  };
}

export function getExperiments(
  state: ExperimentsState
): Array<Experiment> {
  return state.data;
}

export function getExperimentByID(
  state: ExperimentsState,
  addonID: string
): Experiment {
  return state.data.filter(e => e.addon_id === addonID)[0];
}

export function getExperimentBySlug(
  state: ExperimentsState,
  filter: string
): Experiment {
  return state.data.filter(e => e.slug === filter)[0];
}

export function getExperimentByURL(
  state: ExperimentsState,
  url: string
): Experiment {
  return state.data.filter(e => e.xpi_url === url)[0];
}

export function getExperimentInProgress(
  state: ExperimentsState
): Experiment {
  return state.data.filter(e => e.inProgress)[0];
}

export default function experimentsReducer(
  state: ?ExperimentsState,
  action: ExperimentsActions
): ExperimentsState {
  if (!state) {
    return defaultState();
  }
  switch (action.type) {
    case "UPDATE_EXPERIMENT":
      return updateExperiment(state, action);
    default:
      return state;
  }
}
