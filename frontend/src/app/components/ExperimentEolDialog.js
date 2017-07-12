// @flow

import { Localized } from 'fluent-react/compat';
import React from 'react';

type ExperimentEolDialogProps = {
  title: string,
  onCancel: Function,
  onSubmit: Function
}

export default class ExperimentEolDialog extends React.Component {
  props: ExperimentEolDialogProps

  render() {
    const { title } = this.props;
    return (
      <div className="modal-container">
        <div id="retire-dialog-modal" className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper warning-modal">
            <Localized id="disableHeader">
              <h3 className="title modal-header">Disable Experiment?</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
          <form>
            <div className="modal-content modal-form">
              <Localized id="eolDisableMessage" $title={title}>
                <p className="centered"></p>
              </Localized>
            </div>
            <div className="modal-actions">
              <Localized id="disableExperiment" $title={title}>
                <button onClick={e => this.proceed(e)} className="submit button warning large"></button>
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
}
