import React from 'react';

import { isExperimentEnabled } from '../reducers/addon';

import ExperimentRowCard from './ExperimentRowCard';
import Loading from './Loading';

export default class ExperimentCardList extends React.Component {
  getExperiments() {
    if (!this.props.except) {
      return this.props.experiments;
    }
    return this.props.experiments.filter(experiment => (
      experiment.slug !== this.props.except
    ));
  }

  renderLoading() {
    return (
      <div className="card-list experiments">
        <Loading />
      </div>
    );
  }

  renderExperiments() {
    return (
      <div className="card-list experiments">
        {this.getExperiments().map((experiment, key) => (
          <ExperimentRowCard experiment={experiment}
                             enabled={isExperimentEnabled(experiment)}
                             key={key} {...this.props} />
        ))}
      </div>
    );
  }

  render() {
    if (this.props.experiments.length === 0) {
      return this.renderLoading();
    }
    return this.renderExperiments();
  }
}
