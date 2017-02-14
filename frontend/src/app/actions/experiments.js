import { createActions } from 'redux-actions';

export default createActions({

  updateExperiment: (addonID, data) => ({ addonID, data }),

  fetchExperiments: (experimentsUrl) => {
    return fetch(experimentsUrl)
      .then(response => response.json())
      .then(data => ({
        lastFetched: Date.now(),
        experimentsLoaded: true,
        data: data.results
      }));
  },

  fetchUserCounts: (countsUrl) => {
    return fetch(countsUrl)
      .then(
        response => response.json(),
        () => ({}))
      .then(counts => ({
        data: counts
      }));
  }

});
