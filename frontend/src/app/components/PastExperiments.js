import classnames from 'classnames';
import React, { PropTypes } from 'react';

import ExperimentCardList from '../components/ExperimentCardList';
import LayoutWrapper from '../components/LayoutWrapper';


export default class PastExperiments extends React.Component {

  constructor(props) {
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
            style={{ margin: '0 auto', display: 'table' }}
            onClick={() => this.setState({ showPastExperiments: true })}
            data-l10n-id="viewPastExperiments">View Past Experiments</div>}
        {showPastExperiments &&
        <div>
          <div className={classnames(['button past-experiments', 'outline'])}
              style={{ margin: '0 auto', display: 'table' }}
              onClick={() => this.setState({ showPastExperiments: false })}
              data-l10n-id="hidePastExperiments">Hide Past Experiments</div>
          <div style={{ height: '40px' }}/>
          <ExperimentCardList {...this.props} experiments={pastExperiments} eventCategory="HomePage Interactions" />
        </div>}
      </LayoutWrapper>
    );
  }
}

PastExperiments.PropTypes = {
  pastExperiments: PropTypes.array
};
