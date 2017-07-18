// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import parser from 'html-react-parser';
import React from 'react';

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

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'tour-modal')}>
          <header className="modal-header-wrapper">
            <Localized id="experimentPreFeedbackTitle" $title={experiment.title}>
              <h3 className="modal-header"></h3>
            </Localized>
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
                <Localized id="experimentPreFeedbackLinkCopy" $title={experiment.title}>
                  <a onClick={e => this.feedback(e)}
                     href={surveyURL}></a>
                </Localized>
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
