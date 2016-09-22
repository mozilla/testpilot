import React from 'react';
import moment from 'moment';
import ExperimentRowCard from './ExperimentRowCard';
import Loading from './Loading';

export default function ExperimentCardList({
  navigateTo, isExperimentEnabled, hasAddon, isDev, experiments, except, eventCategory
}) {
  const experimentsSorted = [].concat(experiments);

  experimentsSorted.sort((a, b) => {
    if (a.id > b.id) { return 1; }
    if (a.id < b.id) { return -1; }
    return 0;
  });

  const experimentsReduced = setCurrentExperiments(isDev, experimentsSorted);

  return (
    <div className="card-list experiments">
      {(experiments.length === 0) ?
        <Loading /> :
        experimentsReduced.map((experiment, key) =>
          (!except || except.slug !== experiment.slug) &&
            <ExperimentRowCard key={key}
                               navigateTo={navigateTo}
                               experiment={experiment}
                               enabled={isExperimentEnabled(experiment)}
                               hasAddon={hasAddon}
                               eventCategory={eventCategory} />) }
    </div>
  );
}

function setCurrentExperiments(isDev, allExperiments) {
  const currentExperiments = [];
  const utcNow = moment.utc();
  if (isDev) return allExperiments;
  allExperiments.forEach((experiment) => {
    if (moment(utcNow).isAfter(experiment.launch_date) || typeof experiment.launch_date === 'undefined') {
      currentExperiments.push(experiment);
    }
  });
  return currentExperiments;
}

