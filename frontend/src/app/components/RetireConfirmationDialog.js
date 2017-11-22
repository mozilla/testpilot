// @flow
import { Localized } from 'fluent-react/compat';
import React from 'react';

import LocalizedHtml from '../components/LocalizedHtml';

type RetireConfirmationDialogProps = {
  uninstallAddon: Function,
  onDismiss: Function,
  sendToGA: Function,
  navigateTo?: Function
}

export default class RetireConfirmationDialog extends React.Component {
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
        <div id="retire-dialog-modal" className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper warning-modal">
            <Localized id="retireDialogTitle">
              <h3 className="title modal-header">Uninstall Test Pilot?</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
          </header>
          <form>

            <div className="modal-content">
              <Localized id="retireMessageUpdate">
                <p className="centered">As you wish. This will uninstall Test Pilot. You can disable individual experiments from the Firefox Add-ons Manager.</p>
              </Localized>
              <LocalizedHtml id="retireEmailMessage">
                <p className="centered small">To opt out of email updates, simply click the <em>unsubscribe</em> link on any Test Pilot email.</p>
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
    const { sendToGA, navigateTo, uninstallAddon } = this.props;
    e.preventDefault();
    uninstallAddon();
    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Retire'
    });
    if (typeof navigateTo !== 'undefined') {
      navigateTo('/retire');
    }
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.onDismiss();
  }

  handleKeyDown(e: Object) {
    switch (e.key) {
      case 'Escape':
        this.cancel(e);
        break;
      case 'Enter':
        this.proceed(e);
        break;
      default:
        break;
    }
  }
}
