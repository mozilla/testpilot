// @flow
import { Localized } from "fluent-react/compat";
import React from "react";
import { isValidNumber } from "libphonenumber-js";
import { validator } from "email-validator";

import { subscribeToBasket, subscribeToBasketSMS, acceptedSMSCountries } from "../../lib/utils";

// import "./index.scss";

type MobileDialogProps = {
  getWindowLocation: Function,
  onDismiss: Function,
  sendToGA: Function
}

type MobileDialogState = {
  isSuccess: boolean,
  isError: boolean,
  allowSMS: boolean,
  recipient: string
}

export default class MobileDialog extends React.Component {
  props: MobileDialogProps
  state: MobileDialogState

  modalContainer: Object

  constructor(props: MobileDialogProps) {
    super(props);
    this.state = {
      isSuccess: false,
      isError: false,
      allowSMS: false,
      recipient: ""
    };
  }

  componentDidMount() {
    this.focusModalContainer();
  }

  render() {
    const { isSuccess } = this.state;

    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
        {allowSMS && this.renderSMSHeader()}
        {allowSMS && this.renderHeader()}
        <hr/>
        {!isSuccess && this.renderForm()}
        {isSuccess && this.renderSuccess()}
      </div>
    );
  }

  renderSMSHeader() {
    const message = isIOS ? (<Localized id="mobileDialogMessageIOS" $title={title}><p>Download {title} from the iOS App Store.</p></Localized>)
          : (<Localized id="mobileDialogMessageAndroid" $title={title}><p>Download {title} from the Google Play Store.</p></Localized>);

    return ({message});
  }

  renderSuccess() {
    const secondaryId = allowSMS ? "mobileDialogSuccessSecondarySMS" : "mobileDialogSuccessSecondary";
    const secondaryText = allowSMS ? "Check your device for the email or text message." : "Check your device for the email.";

    return (
      <div>
        <Localized id="mobileDialogSuccessMain">
          <p className="success primary">Download link sent!</p>
        </Localized>
        <Localized id={secondaryId}>
          <p className="success primary">{secondaryText}</p>
        </Localized>
        <Localized id="mobileDialogButtonSuccess">
          <button className="button large default">Thanks!</button>
        </Localized>
        <Localized id="mobileDialogAnotherDeviceLink">
          <a className="default"
            onClick={this.reset}>Send to another device</a>
        </Localized>
      </div>

    );
  }

  handleRecipientChange(evt: Object) {
    if (this.state.allowSMS) {
      return (isValidNumber(evt.target.value) || validator(evt.target.value));
    }
    return validator(evt.target.value);
  }

  renderForm() {
    const { allowSMS } = this.props;
    const placeholderId = allowSMS ? "mobileDialogPlaceholderSMS" : "mobileDialogPlaceholder";
    const placeholderText = allowSMS ? "Enter your Phone/Email" : "Enter your Email";
    const errorId = allowSMS ? "mobileDialogErrorSMS" : "mobileDialogError";
    const errorText = allowSMS ? "Enter a valid phone number or email:" : "Enter a valid email:";

    return (
      <form className="mobile-link-form"
        onSubmit={this.handleSubmit} data-no-csrf>
        <Localized id={placeholderId} attrs={{placeholder: true}}>
          <input
            type='text'
            placeholder={placeholderText}
            required
            value={this.props.recipient}
            onChange={this.handleRecipientChange}
          />
        </Localized>
        {this.state.isError && <Localized id={errorId}>
         <p className="error">{errorText}</p>
         </Localized>}
        <Localized id="mobileDialogButton">
          <button className={"button large default"}>Send me the Download Link</button>
        </Localized>
      </form>
    );
  }

  renderForm() {
    return (
      <div id="first-page" className="modal feedback-modal modal-bounce-in">
        <header className="modal-header-wrapper">
          <Localized id="mobileDialogTitle">
            <h3 className="modal-header">Get the App</h3>
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

  focusModalContainer() {
    if (!this.modalContainer) {
      return;
    }
    this.modalContainer.focus();
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
