// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import ExperimentCardList from "../ExperimentCardList";
import LayoutWrapper from "../LayoutWrapper";

import "./index.scss";

type PastExperimentsProps = {
  pastExperiments: Array<Object>
}

type PastExperimentsState = {
  showPastExperiments: boolean
}

export default class PastExperiments extends React.Component {
  props: PastExperimentsProps
  state: PastExperimentsState

  constructor(props: PastExperimentsProps) {
    super(props);
    this.state = {
      showPastExperiments: false
    };
  }

  render() {
    const { pastExperiments } = this.props;
    const { showPastExperiments } = this.state;

    return (
      <React.Fragment>
        {pastExperiments.length > 0 && !showPastExperiments &&
          <div className="past-experiments-button-wrapper">
            <Localized id="viewPastExperiments">
              <div className={classnames(["button past-experiments", "outline"])}
                onClick={() => this.setState({ showPastExperiments: true })}>
                View Past Experiments
              </div>
            </Localized>
          </div>}
        < LayoutWrapper flexModifier = "card-list" >
          {showPastExperiments &&
          <div>
            <Localized id="hidePastExperiments">
              <div className={classnames(["button past-experiments", "outline"])}
                onClick={() => this.setState({ showPastExperiments: false })}>
                Hide Past Experiments
              </div>
            </Localized>
            <div className="past-experiments-padding" />
            <ExperimentCardList {...this.props} experiments={pastExperiments} eventCategory="HomePage Interactions" />
          </div>}
        </LayoutWrapper>
      </React.Fragment>
    );
  }
}
