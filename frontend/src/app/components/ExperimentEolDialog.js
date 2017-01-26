import React from 'react';

export default class ExperimentEolDialog extends React.Component {

  render() {
    const { title } = this.props;
    return (
      <div className="modal-container">
        <div id="retire-dialog-modal" className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper warning-modal">
            <h3 className="title modal-header" data-l10n-id="disableHeader">Disable Experiment?</h3>
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
          <form>
            <div className="modal-content modal-form">
              <p data-l10n-id="eolDisableMessage" data-l10n-args={JSON.stringify({ title })} className="centered"></p>
            </div>
            <div className="modal-actions">
              <button onClick={e => this.proceed(e)} data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="submit button warning large"></button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  proceed(e) {
    e.preventDefault();
    this.props.onSubmit(e);
  }

  cancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }
}

ExperimentEolDialog.propTypes = {
  title: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onSubmit: React.PropTypes.func
};
