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

  modalContainer: Object

  componentDidMount() {
    if (this.modalContainer !== undefined) {
      this.modalContainer.focus();
    }
  }

  render() {
    const { experiment, surveyURL } = this.props;

    return (
      <div className="modal-container" tabIndex="0"
           ref={modalContainer => { this.modalContainer = modalContainer; }}
           onKeyDown={e => this.handleKeyDown(e)}>
        <div className={classnames('modal', 'tour-modal')}>
          <header className="modal-header-wrapper">
            <Localized id="experimentPreFeedbackTitle" $title={experiment.title}>
              <h3 className="modal-header">{experiment.title} feedback</h3>
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
                  <a onClick={e => this.feedback(e, e.target.getAttribute('href'))}
                     href={surveyURL}>Give feedback about the {experiment.title} experiment</a>
                </Localized>
              </div>
            </div>
        </div>
      </div>
    );
  }

  feedback(e: Object, url: string) {
    e.preventDefault();

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: this.props.experiment.title,
      outboundURL: url
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

  handleKeyDown(e: Object) {
    switch (e.key) {
      case 'Escape':
        this.cancel(e);
        break;
      case 'Enter': {
        const { surveyURL } = this.props;
        this.feedback(e, surveyURL);

        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = surveyURL;
        break;
      }
      default:
        break;
    }
  }
}
