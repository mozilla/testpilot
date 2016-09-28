import { createActions } from 'redux-actions';

export default createActions({

  updateExperiment: (addonID, data) => ({ addonID, data }),

  fetchExperiments: (experimentsUrl, countsUrl) => {
    let experiments = [];
    return fetch(experimentsUrl)
      .then(response => response.json())
      .then(data => {
        experiments = data.results;
        return fetch(countsUrl);
      })
      .then(response => response.json())
      .then(counts => ({
        lastFetched: Date.now(),
        experimentsLoaded: true,
        data: experiments.map(experiment => ({
          ...experiment,
          installation_count: counts[experiment.addon_id]
        }))
      }));
  }

});
