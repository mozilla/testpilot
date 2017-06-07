// @flow

import React from 'react';
import NewsletterForm from './NewsletterForm';
import { subscribeToBasket } from '../lib/utils';

type EmailDialogProps = {
  getWindowLocation: Function,
  onDismiss: Function,
  sendToGA: Function
}

type EmailDialogState = {
  isSuccess: boolean,
  isError: boolean,
  email: string,
  privacy: boolean
}

export default class EmailDialog extends React.Component {
  props: EmailDialogProps
  state: EmailDialogState

  constructor(props: EmailDialogProps) {
    super(props);
    this.state = {
      isSuccess: false,
      isError: false,
      email: '',
      privacy: false
    };
  }

  render() {
    const { isSuccess, isError } = this.state;

    return (
      <div className="modal-container">
        {!isSuccess && !isError && this.renderForm()}
        {isSuccess && this.renderSuccess()}
        {isError && this.renderError()}
      </div>
    );
  }

  renderForm() {
    const { email, privacy } = this.state;

    return (
      <div id="first-page" className="modal feedback-modal modal-bounce-in">
        <header className="modal-header-wrapper">
          <h3 className="modal-header" data-l10n-id="emailOptInDialogTitle">Welcome to Test Pilot!</h3>
          <div className="modal-cancel" onClick={e => this.skip(e)}/>
        </header>
        <div className="modal-content modal-form centered">
          <p data-l10n-id="emailOptInMessage" className="">Find out about new experiments and see test results for experiments you've tried.</p>
          <NewsletterForm {...{ email, privacy }}
                          isModal={true}
                          setEmail={newEmail => this.setState({ email: newEmail })}
                          setPrivacy={newPrivacy => this.setState({ privacy: newPrivacy })}
                          subscribe={this.handleSubscribe.bind(this)} />
        </div>
      </div>
    );
  }

  renderSuccess() {
    return (
      <div id="second-page" className="modal">
        <header className="modal-header-wrapper">
          <h3 className="modal-header" data-l10n-id="emailOptInConfirmationTitle">Email Sent</h3>
          <div className="modal-cancel" onClick={e => this.continue(e)} />
        </header>
        <div className="modal-content centered">
          <div className="envelope" />
          <p data-l10n-id="emailOptInSuccessMessage2">Thank you!</p>
        </div>
        <div className="modal-actions">
          <button id="email-success-continue" onClick={e => this.continue(e)} className="button default large" data-l10n-id="emailOptInConfirmationClose">On to the experiments...</button>
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div id="second-page" className="modal">
        <header className="modal-header-wrapper">
          <h3 className="modal-header" data-l10n-id="emailOptInDialogTitle">Welcome to Test Pilot!</h3>
          <div className="modal-cancel" onClick={e => this.continue(e)} />
        </header>
        <div className="modal-content centered">
          <div className="envelope" />
          <p className="error" data-l10n-id="newsletterFooterError">
            There was an error submitting your email address. Try again?
          </p>
        </div>
        <div className="modal-actions">
          <button id="email-success-continue" onClick={e => this.reset(e)} className="button default large" data-l10n-id="newsletterFormSubmitButton">Sign Up Now</button>
        </div>
      </div>
    );
  }

  handleEmailChange(e: Object) {
    this.setState({ email: e.target.value });
  }

  handleSubscribe(email: string) {
    const { sendToGA } = this.props;
    const source = '' + this.props.getWindowLocation();

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    });

    subscribeToBasket(email, source).then(response => {
      if (response.ok) {
        sendToGA('event', {
          eventCategory: 'HomePage Interactions',
          eventAction: 'button click',
          eventLabel: 'email submitted to basket'
        });
      }
      this.setState({
        isSuccess: response.ok,
        isError: !response.ok
      });
    });
  }

  reset(e: Object) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isSuccess: false, isError: false });
  }

  skip(e: Object) {
    const { sendToGA } = this.props;

    e.preventDefault();
    e.stopPropagation();

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      // review TODO: The label says 'skip'. Should I just use that? Want to make
      // the events readable and specific on the GA side.
      eventLabel: 'Skip email'
    });

    this.close();
  }

  continue(e: Object) {
    const { sendToGA } = this.props;

    e.preventDefault();

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'On to the experiments'
    });

    this.close();
  }

  close() {
    if (this.props.onDismiss) { this.props.onDismiss(); }
  }

}
