// @flow
import { Localized } from "fluent-react/compat";
import React from "react";
import { withRouter } from "react-router-dom";

import LocalizedHtml from "../LocalizedHtml";

type RetireConfirmationDialogProps = {
  uninstallAddon: Function,
  onDismiss: Function,
  sendToGA: Function,
  history: Object
}

export class RetireConfirmationDialog extends React.Component {
  props: RetireConfirmationDialogProps

  modalContainer: Object

  componentDidMount() {
    if (this.modalContainer !== undefined) {
      this.modalContainer.focus();
    }
  }

  render() {
    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
        <div id="retire-dialog-modal" className="modal feedback-modal modal-bounce-in uninstall-modal">
          <header className="modal-header-wrapper warning-modal">
            <Localized id="retireDialogTitle">
              <h3 className="title modal-header">Uninstall Test Pilot?</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
          <form>
            <div className="modal-content centered">
              <div className="retire-icon"></div>
              <Localized id="retireMessageUpdate">
                <p>As you wish. This will uninstall Test Pilot. You can disable individual experiments from the Firefox Add-ons Manager.</p>
              </Localized>
              <LocalizedHtml id="retireEmailMessage">
                <p>To opt out of email updates, simply click the <em>unsubscribe</em> link on any Test Pilot email.</p>
              </LocalizedHtml>
            </div>
            <div className="modal-actions">
              <Localized id="retireSubmitButton">
                <button onClick={e => this.proceed(e)} className="submit button warning large">Proceed</button>
              </Localized>
            </div>
          </form>
        </div>
      </div>
    );
  }

  proceed(e: Object) {
    const { sendToGA, uninstallAddon, history } = this.props;
    e.preventDefault();
    uninstallAddon();
    sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "Retire"
    });
    history.push("/retire");
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.onDismiss();
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

export default withRouter(RetireConfirmationDialog);
