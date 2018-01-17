// @flow
import { Localized } from "fluent-react/compat";
import React from "react";

import NewsletterForm from "../NewsletterForm";
import { subscribeToBasket } from "../../lib/utils";

import "./index.scss";

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

  modalContainer: Object
  submitButton: Object

  constructor(props: EmailDialogProps) {
    super(props);
    this.state = {
      isSuccess: false,
      isError: false,
      email: "",
      privacy: false
    };
  }

  componentDidMount() {
    this.focusModalContainer();
  }

  render() {
    const { isSuccess, isError } = this.state;

    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
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
          <Localized id="emailOptInDialogTitle">
            <h3 className="modal-header">Welcome to Test Pilot!</h3>
          </Localized>
          <div className="modal-cancel" onClick={e => this.skip(e)}/>
        </header>
        <div className="modal-content centered">
          <Localized id="emailOptInMessage">
            <p>Find out about new experiments and see test results for experiments you&apos;ve tried.</p>
          </Localized>
          <NewsletterForm {...{ email, privacy }}
            isModal={true}
            setEmail={newEmail => this.setState({ email: newEmail })}
            setPrivacy={newPrivacy => this.setState({ privacy: newPrivacy })}
            subscribe={this.handleSubscribe.bind(this)}
            buttonRef={button => this.submitButton = button} />
        </div>
      </div>
    );
  }

  renderSuccess() {
    return (
      <div id="second-page" className="modal">
        <header className="modal-header-wrapper">
          <Localized id="newsletterFooterSuccessHeader">
            <h3 className="modal-header">Thanks!</h3>
          </Localized>
          <div className="modal-cancel" onClick={e => this.continue(e)} />
        </header>
        <div className="modal-content centered">
          <div className="envelope" />
          <Localized id="newsletterFooterSuccessBody">
            <p>Thank you!</p>
          </Localized>
        </div>
        <div className="modal-actions">
          <Localized id="emailOptInConfirmationClose">
            <button id="email-success-continue" onClick={e => this.continue(e)} className="button default large">On to the experiments&hellip;</button>
          </Localized>
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div id="second-page" className="modal">
        <header className="modal-header-wrapper">
          <Localized id="emailOptInDialogErrorTitle">
            <h3 className="modal-header">Oh no!</h3>
          </Localized>
          <div className="modal-cancel" onClick={e => this.continue(e)} />
        </header>
        <div className="modal-content centered">
          <div className="envelope" />
          <Localized id="newsletterFooterError">
            <p className="error">
              There was an error submitting your email address. Try again?
            </p>
          </Localized>
        </div>
        <div className="modal-actions">
          <Localized id="newsletterFormSubmitButton">
            <button id="email-success-continue" onClick={e => this.reset(e)} className="button default large">Sign Up Now</button>
          </Localized>
        </div>
      </div>
    );
  }

  focusModalContainer() {
    if (!this.modalContainer) {
      return;
    }
    this.modalContainer.focus();
  }

  handleEmailChange(e: Object) {
    this.setState({ email: e.target.value });
  }

  handleSubscribe(email: string) {
    const { sendToGA } = this.props;
    const source = "" + this.props.getWindowLocation();

    sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "Sign me up"
    });

    subscribeToBasket(email, source).then(response => {
      if (response.ok) {
        sendToGA("event", {
          eventCategory: "HomePage Interactions",
          eventAction: "button click",
          eventLabel: "email submitted to basket"
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

    sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      // review TODO: The label says 'skip'. Should I just use that? Want to make
      // the events readable and specific on the GA side.
      eventLabel: "Skip email"
    });

    this.close();
  }

  continue(e: Object) {
    const { sendToGA } = this.props;

    e.preventDefault();

    sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "On to the experiments"
    });

    this.close();
  }

  close() {
    if (this.props.onDismiss) { this.props.onDismiss(); }
  }

  handleKeyDown(e: Object) {
    const { isSuccess, isError } = this.state;

    switch (e.key) {
      case "Escape":
        if (!isSuccess && !isError) {
          this.skip(e);
        } else if (isSuccess) {
          this.continue(e);
        } else if (isError) {
          this.continue(e);
        }
        break;
      case "Enter":
        if (!isSuccess && !isError) {
          e.preventDefault();
          e.stopPropagation();
          // Keeps the modal-container focused
          // after success/error state renders
          this.focusModalContainer();
          this.submitButton.click();
        } else if (isSuccess) {
          this.continue(e);
        } else if (isError) {
          this.reset(e);
        }
        break;
      default:
        break;
    }
  }

}
