// @flow

import classnames from 'classnames';
import React from 'react';

import ExperimentCardList from '../components/ExperimentCardList';
import LayoutWrapper from '../components/LayoutWrapper';


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
      <LayoutWrapper flexModifier="card-list">
        {pastExperiments.length > 0 && !showPastExperiments &&
        <div className={classnames(['button past-experiments', 'outline'])}
            onClick={() => this.setState({ showPastExperiments: true })}
            data-l10n-id="viewPastExperiments">View Past Experiments</div>}
        {showPastExperiments &&
        <div>
          <div className={classnames(['button past-experiments', 'outline'])}
              onClick={() => this.setState({ showPastExperiments: false })}
              data-l10n-id="hidePastExperiments">Hide Past Experiments</div>
          <div className="past-experiments-padding" />
          <ExperimentCardList {...this.props} experiments={pastExperiments} eventCategory="HomePage Interactions" />
        </div>}
      </LayoutWrapper>
    );
  }
}
