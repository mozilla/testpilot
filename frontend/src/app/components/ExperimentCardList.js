import React from 'react';
import ExperimentRowCard from './ExperimentRowCard';
import Loading from './Loading';

export default function ExperimentCardList({
  navigateTo, isExperimentEnabled, hasAddon, experiments, except, eventCategory
}) {
  const experimentsSorted = [].concat(experiments);
  experimentsSorted.sort((a, b) => {
    if (a.order > b.order) { return 1; }
    if (a.order < b.order) { return -1; }
    return 0;
  });

  return (
    <div className="card-list experiments">
      {(experiments.length === 0) ?
        <Loading /> :
        experimentsSorted.map((experiment, key) =>
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
