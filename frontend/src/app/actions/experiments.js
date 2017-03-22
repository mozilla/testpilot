
function updateExperiment(addonID, data) {
  return {
    type: 'UPDATE_EXPERIMENT',
    payload: { addonID, data }
  };
}

function fetchUserCounts(countsUrl) {
  return fetch(countsUrl)
    .then(
      response => {
        if (response.ok) {
          return response.json().then(data => ({
            type: 'FETCH_USER_COUNTS',
            payload: { data }
          }));
        }
        throw new Error('Could not get user counts');
      });
}

export default {
  updateExperiment,
  fetchUserCounts
};
