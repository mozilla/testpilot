// @flow
import { Localized } from "fluent-react/compat";
import React from "react";

import Copter from "../../components/Copter";
import { buildSurveyURL } from "../../lib/utils";

type ExperimentDisableDialogProps = {
  experiment: Object,
  installed: Object,
  clientUUID: string,
  onCancel: Function,
  onSubmit: Function,
  sendToGA: Function
}

export default class ExperimentDisableDialog extends React.Component {
  props: ExperimentDisableDialogProps

  modalContainer: Object

  componentDidMount() {
    if (this.modalContainer !== undefined) {
      this.modalContainer.focus();
    }
  }

  render() {
    const { experiment, installed, clientUUID } = this.props;
    const { title, survey_url } = experiment;

    const surveyURL = buildSurveyURL("disable", title, installed, clientUUID, survey_url);

    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
        <div id="disabled-feedback-modal" className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper">
            <Localized id="feedbackUninstallTitle" $title={ experiment.title }>
              <h3 className="modal-header">Thank You!</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.cancel(e)} />
          </header>
          <div className="modal-content">
            <Copter small={true}/>
            <Localized id="feedbackUninstallCopy">
              <p className="centered">
                Your participation in Firefox Test Pilot means a lot!
                Please check out our other experiments, and stay tuned for more to come!
              </p>
            </Localized>
          </div>
          <div className="modal-actions">
            <Localized id="feedbackSubmitButton">
              <a
                onClick={e => this.submit(e)} href={surveyURL}
                target="_blank" rel="noopener noreferrer"
                className="submit button default large quit">
                Take a quick survey
              </a>
            </Localized>
          </div>
        </div>
      </div>
    );
  }

  submit(e: Object) {
    this.props.sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "exit survey disabled",
      dimension11: this.props.experiment.slug
    });
    this.props.onSubmit(e);
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.onCancel(e);
  }

  handleKeyDown(e: Object) {
    switch (e.key) {
      case "Escape":
        this.cancel(e);
        break;
      case "Enter": {
        this.submit(e);

        const { experiment, installed, clientUUID } = this.props;
        const { title, survey_url } = experiment;
        const surveyURL = buildSurveyURL("disable", title, installed, clientUUID, survey_url);

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
