// @flow

export type Experiment = {
  addon_id: string,
  completed: string,
  slug: string,
  xpi_url: string,
  inProgress: boolean,
  installation_count: number
};

export type ExperimentsState = {
  data: Array<Experiment>
};

function defaultState(): ExperimentsState {
  return {
    data: []
  };
}

type UserCounts = {
  [name: string]: number
};

export type FetchUserCountsAction = {
  type: "FETCH_USER_COUNTS",
  payload: UserCounts
};

export type UpdateExperimentAction = {
  type: "UPDATE_EXPERIMENT",
  payload: {
    addonID: string,
    data: Experiment
  }
};

export type SetSlugAction = {
  type: 'SET_SLUG',
  payload: string
};

type ExperimentsActions = FetchUserCountsAction | UpdateExperimentAction | SetSlugAction;

function fetchUserCounts(
  state: ExperimentsState,
  { payload: newNumbers }: FetchUserCountsAction
): ExperimentsState {
  const newExperiments = [];
  for (const exp: Experiment of state.data) {
    if (newNumbers[exp.addon_id]) {
      newExperiments.push({
        ...exp,
        installation_count: newNumbers[exp.addon_id]
      });
    } else {
      newExperiments.push(exp);
    }
  }
  return {
    ...state,
    data: newExperiments
  };
}

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

function setSlug(state, { payload: slug }: SetSlugAction): ExperimentsState {
  return {
    ...state,
    slug
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
    case 'SET_SLUG':
      return setSlug(state, action);
    case 'FETCH_USER_COUNTS':
      return fetchUserCounts(state, action);
    case 'UPDATE_EXPERIMENT':
      return updateExperiment(state, action);
    default:
      return state;
  }
}
