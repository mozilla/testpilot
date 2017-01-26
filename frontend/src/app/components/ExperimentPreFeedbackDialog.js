import React from 'react';
import classnames from 'classnames';

export default class ExperimentPreFeedbackDialog extends React.Component {

  render() {
    const { experiment, surveyURL } = this.props;

    const l10nArgs = JSON.stringify({
      title: experiment.title
    });

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'tour-modal')}>
          <header className="tour-header-wrapper">
            <h3 className="tour-header"
                data-l10n-id="experimentPreFeedbackTitle"
                data-l10n-args={l10nArgs}>{experiment.title} Feedback</h3>
                <div className="tour-cancel" onClick={e => this.cancel(e)}/>
          </header>
            <div className="tour-content">
              <div className="tour-image">
                <img src={experiment.pre_feedback_image} />
                <div className="fade" />
              </div>
              <div className="tour-text" dangerouslySetInnerHTML={{ __html: experiment.pre_feedback_copy }} />
              <div className="tour-text">
                <a data-l10n-id="experimentPreFeedbackLinkCopy"
                   data-l10n-args={l10nArgs} onClick={e => this.feedback(e)}
                   href={surveyURL}>Give feedback about the {experiment.title} experiment</a>
              </div>
            </div>
        </div>
      </div>
    );
  }

  feedback(e) {
    e.preventDefault();

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: this.props.experiment.title,
      outboundURL: e.target.getAttribute('href')
    });
  }

  cancel(e) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel feedback'
    });
    this.props.onCancel(e);
  }
}

ExperimentPreFeedbackDialog.propTypes = {
  experiment: React.PropTypes.object.isRequired,
  surveyURL: React.PropTypes.string.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired
};
