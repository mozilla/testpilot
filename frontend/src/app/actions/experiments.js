import { createActions } from 'redux-actions';
import moment from 'moment';
import config from '../config';

export default createActions({

  updateExperiment: (addonID, data) => ({ addonID, data }),

  fetchExperiments: (experimentsUrl, countsUrl) => {
    let experiments = [];
    return fetch(experimentsUrl)
      .then(response => response.json())
      .then(data => {
        experiments = setCurrentExperiments(data.results);
        return fetch(countsUrl);
      })
      .then(response => response.json())
      .then(counts => ({
        lastFetched: Date.now(),
        experiments: experiments.map(experiment => ({
          ...experiment,
          installation_count: counts[experiment.addon_id]
        }))
      }));
  }
});

// handles how to display experiments
// shows all experiments on dev/local environments
// only shows launched experiments on stage/prod
function setCurrentExperiments(allExperiments) {
  const currentExperiments = [];
  const location = window.location.toString();
  const utcNow = moment.utc();
  const isDev = location.indexOf(config.productionURL) === -1 && location.indexOf(config.stagingURL) === -1;

  if (isDev) return allExperiments;
  allExperiments.forEach((experiment) => {
    if (moment(utcNow).isAfter(experiment.launch_date)) {
      currentExperiments.push(experiment);
    }
  });
  return currentExperiments;
}
