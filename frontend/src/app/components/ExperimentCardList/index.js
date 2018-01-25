import React from "react";

import ExperimentRowCard from "../ExperimentRowCard";
import LayoutWrapper from "../LayoutWrapper";

import "./index.scss";

export default class ExperimentCardList extends React.Component {
  getExperiments() {
    if (!this.props.except) {
      return this.props.experiments;
    }
    return this.props.experiments.filter(experiment => (
      experiment.slug !== this.props.except
    ));
  }

  renderExperiments() {
    const { isExperimentEnabled } = this.props;

    return (
      <LayoutWrapper flexModifier="card-list">
        {this.getExperiments().map((experiment, key) => (
          <ExperimentRowCard {...this.props}
            experiment={experiment}
            enabled={isExperimentEnabled(experiment)}
            key={key} />
        ))}
      </LayoutWrapper>
    );
  }

  render() {
    if (this.props.experiments.length === 0) {
      return null;
    }
    return this.renderExperiments();
  }
}
