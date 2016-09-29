import React from 'react';

import { buildSurveyURL } from '../lib/utils';

export default class ExperimentDisableDialog extends React.Component {
  render() {
    const { experiment, installed } = this.props;
    const { title, survey_url } = experiment;

    const surveyURL = buildSurveyURL('disable', title, installed, survey_url);

    return (
      <div className="modal-container">
        <div id="disabled-feedback-modal" className="modal feedback-modal modal-bounce-in">
          <h3 className="title"
              data-l10n-id="feedbackUninstallTitle"
              data-l10n-args={JSON.stringify({ title: experiment.title })}></h3>
          <div className="modal-content">
            <div className="copter-wrapper">
              <div className="copter"></div>
            </div>
            <p className="centered" data-l10n-id="feedbackUninstallCopy">
              Your participation in Firefox Test Pilot means a lot!
              Please check out our other experiments, and stay tuned for more to come!
            </p>
          </div>
          <div className="modal-actions">
            <a data-l10n-id="feedbackSubmitButton"
               onClick={e => this.submit(e)} href={surveyURL}
               target="_blank" className="submit button default large quit">Take a quick survey</a>
            <a data-l10n-id="feedbackCancelButton" className="cancel modal-escape"
               onClick={e => this.cancel(e)} href="">Close</a>
          </div>
        </div>
      </div>
    );
  }

  submit(e) {
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'exit survey disabled'
    });
    if (this.props.onSubmit) { this.props.onSubmit(e); }
  }

  cancel(e) {
    e.preventDefault();
    if (this.props.onCancel) { this.props.onCancel(e); }
  }
}
