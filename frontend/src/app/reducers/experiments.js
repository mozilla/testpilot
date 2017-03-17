
function fetchUserCounts(state, { payload: { data } }) {
  return {
    ...state,
    data: state.data.map(experiment =>
      ((data[experiment.addon_id]) ? { ...experiment, installation_count: data[experiment.addon_id] } : experiment))
  };
}


function updateExperiment(state, { payload: { addonID, data } }) {
  return {
    ...state,
    data: state.data.map(experiment =>
      ((experiment.addon_id !== addonID) ?  experiment : { ...experiment, ...data }))
  };
}

export function getExperiments(state) {
  return state.data;
}

export function getExperimentByID(state, addonID) {
  state.data.filter(e => e.addon_id === addonID)[0];
}

export function getExperimentBySlug(state, filter) {
  state.data.filter(e => e.slug === filter)[0];
}

export function getExperimentByURL(state, url) {
  state.data.filter(e => e.xpi_url === url)[0];
}

export function getExperimentInProgress(state) {
  state.data.filter(e => e.inProgress)[0];
}

export default function experimentsReducer(state, action) {
  if (state === undefined) {
    return {
      data: []
    };
  }
  switch (action.type) {
    case 'FETCH_USER_COUNTS':
      return fetchUserCounts(state, action);
    case 'UPDATE_EXPERIMENT':
      return updateExperiment(state, action);
    default:
      return state;
  }
}
