// @flow

import { Localized } from "fluent-react/compat";
import React from "react";

type ExperimentEolDialogProps = {
  title: string,
  onCancel: Function,
  onSubmit: Function
}

export default class ExperimentEolDialog extends React.Component {
  props: ExperimentEolDialogProps

  modalContainer: Object

  componentDidMount() {
    if (this.modalContainer !== undefined) {
      this.modalContainer.focus();
    }
  }

  render() {
    const { title } = this.props;
    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
        <div id="retire-dialog-modal" className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper warning-modal">
            <Localized id="disableHeader">
              <h3 className="title modal-header">Disable Experiment?</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
          <form>
            <div className="modal-content">
              <Localized id="eolDisableMessage" $title={title}>
                <p className="centered">
                  The {title} experiment has ended. Once you uninstall it you won&apos;t be able to re-install it through Test Pilot again.
                </p>
              </Localized>
            </div>
            <div className="modal-actions">
              <Localized id="disableExperiment" $title={title}>
                <button onClick={e => this.proceed(e)} className="submit button warning large">
                  Disable {title}
                </button>
              </Localized>
            </div>
          </form>
        </div>
      </div>
    );
  }

  proceed(e: Object) {
    e.preventDefault();
    this.props.onSubmit(e);
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.onCancel();
  }

  handleKeyDown(e: Object) {
    switch (e.key) {
      case "Escape":
        this.cancel(e);
        break;
      case "Enter":
        this.proceed(e);
        break;
      default:
        break;
    }
  }
}
