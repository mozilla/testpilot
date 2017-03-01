import { createActions } from 'redux-actions';

export default createActions({

  updateExperiment: (addonID, data) => ({ addonID, data }),

  fetchUserCounts: (countsUrl) => {
    return fetch(countsUrl)
      .then(
        response => {
          if (response.ok) {
            return response.json();
          }
          // TODO: in this and the error case log to Sentry
          return {};
        },
        () => ({}))
      .then(counts => ({
        data: counts
      }));
  }

});
