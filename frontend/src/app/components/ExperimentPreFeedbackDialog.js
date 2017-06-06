// @flow

import React from 'react';
import classnames from 'classnames';
import parser from 'html-react-parser';

type ExperimentPreFeedbackDialogProps = {
  experiment: Object,
  surveyURL: string,
  onCancel: Function,
  sendToGA: Function
}

export default class ExperimentPreFeedbackDialog extends React.Component {
  props: ExperimentPreFeedbackDialogProps

  render() {
    const { experiment, surveyURL } = this.props;

    const l10nArgs = JSON.stringify({
      title: experiment.title
    });

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'tour-modal')}>
          <header className="modal-header-wrapper">
            <h3 className="modal-header"
                data-l10n-id="experimentPreFeedbackTitle"
                data-l10n-args={l10nArgs}></h3>
                <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
            <div className="tour-content">
              <div className="tour-image">
                <img src={experiment.pre_feedback_image} />
                <div className="fade" />
              </div>
              <div className="tour-text">
                {parser(experiment.pre_feedback_copy)}
              </div>
              <div className="tour-text">
                <a data-l10n-id="experimentPreFeedbackLinkCopy"
                   data-l10n-args={l10nArgs} onClick={e => this.feedback(e)}
                   href={surveyURL}></a>
              </div>
            </div>
        </div>
      </div>
    );
  }

  feedback(e: Object) {
    e.preventDefault();

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: this.props.experiment.title,
      outboundURL: e.target.getAttribute('href')
    });
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel feedback'
    });
    this.props.onCancel(e);
  }
}
