// @flow
import React from "react";
import classnames from "classnames";
// $FlowFixMe
import { isValidNumber } from "libphonenumber-js";
// $FlowFixMe
import { validate } from "email-validator";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";
import Loading from "../../components/Loading";

import { subscribeToBasket, subscribeToBasketSMS, acceptedSMSCountries } from "../../lib/utils";

const COUNTRY_CODE_ENDPOINT = "https://www.mozilla.org/country-code.json";

/* TODO:
- fix "mobile experiment" logic to include "ios" and "android" when only 1 is present.
- fix input localization
- learn more notice links
*/

type MobileDialogProps = {
  getWindowLocation: Function,
  onCancel: Function,
  sendToGA: Function,
  experiment: Object
}

type MobileDialogState = {
  loading: boolean,
  isSuccess: boolean,
  isError: boolean,
  allowSMS: boolean,
  submitAttempted: boolean,
  recipient: string,
  country: string
}

const DEFAULT_STATE = {
  loading: true,
  isSuccess: false,
  isError: false,
  allowSMS: false,
  submitAttempted: false,
  recipient: "",
  country: "US"
};

export default class MobileDialog extends React.Component {
  props: MobileDialogProps
  state: MobileDialogState

  modalContainer: Object

  constructor(props: MobileDialogProps) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  componentDidMount() {
    this.focusModalContainer();
    this.fetchCountryCode();
  }

  fetchCountryCode() {
    // we use XMLHttpRequest here over fetch, because of issues with
    // the country code endpoint not being parse correctly with
    // fetch() for some reason I haven't figured out yet.
    const req = new XMLHttpRequest();
    req.onerror = (e) => {
      this.setState({ loading: false});
    };

    req.onload = (e) => {
      // $FlowFixMe - EventTarget type is missing response property
      const country = e.target.response.country_code;
      if (acceptedSMSCountries.includes(country)) {
        this.setState({
          loading: false,
          allowSMS: true,
          // $FlowFixMe - EventTarget type is missing response property
          country: e.target.response.country_code
        });
      } else this.setState({ loading: false });
    };
    req.open("GET", COUNTRY_CODE_ENDPOINT);
    req.responseType = "json";
    req.send();
  }

  render() {
    const { experiment } = this.props;
    const { title, android_url, ios_url } = experiment;
    const { isSuccess, allowSMS, loading } = this.state;

    const headerMessage = ios_url ? (<LocalizedHtml id="mobileDialogMessageIOS" $title={title}>
      <p>Download <b>{title}</b> from the iOS App Store.</p></LocalizedHtml>) : (<LocalizedHtml id="mobileDialogMessageAndroid" $title={title}><p>Download <b>{title}</b> from the Google Play Store.</p></LocalizedHtml>);

    const headerImg = ios_url ? (<a href={ios_url} target="_blank"><img className="mobile-header-img" src="/static/images/ios.svg"/></a>) : (<a href={android_url} target="_blank"><img className="mobile-header-img" src="/static/images/google-play.png"/></a>);

    const learnMore = (<Localized id="mobileDialogNoticeLearnMoreLink">
      <a target="_blank" rel="noopener noreferrer" href="">Learn More</a>
    </Localized>);

    const notice = allowSMS ? (<Localized id="mobileDialogNoticeSMS" $learnMore={learnMore}><p className="notice">SMS service available in select countries only. SMS & data rates may apply. The intended recipient of the email or SMS must have consented. {learnMore}</p></Localized>)
      : (<Localized id="mobileDialogNotice" $learnMore={learnMore}><p className="notice">The intended recipient of the email must have consented. {learnMore}</p></Localized>);

    return (
      <div className="modal-container mobile-modal" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => this.handleKeyDown(e)}>
        <div className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper">
            <Localized id="mobileDialogTitle">
              <h3 className="modal-header">Get the App</h3>
            </Localized>
            <div className="modal-cancel" onClick={this.close}/>
          </header>
          <div className="modal-content centered default-background">
            <div className="header-wrapped">
              {headerMessage}
              {headerImg}
            </div>
            {loading && <Loading/>}
            {!loading && !isSuccess && this.renderForm()}
            {!loading && !isSuccess && notice}
            {isSuccess && this.renderSuccess()}
          </div>
        </div>
      </div>
    );
  }

  renderSuccess() {
    const { allowSMS } = this.state;
    const secondaryId = allowSMS ? "mobileDialogSuccessSecondarySMS" : "mobileDialogSuccessSecondary";
    const secondaryText = allowSMS ? "Check your device for the email or text message." : "Check your device for the email.";

    return (
      <div className="success-section">
        <Localized id="mobileDialogSuccessMain">
          <p className="success-msg">Download link sent!</p>
        </Localized>
        <Localized id={secondaryId}>
          <p className="success-secondary">{secondaryText}</p>
        </Localized>
        <Localized id="mobileDialogButtonSuccess">
          <button className="button large secondary" onClick={this.close}>Thanks!</button>
        </Localized>
        <Localized id="mobileDialogAnotherDeviceLink">
          <a href="#" className="send-to-device" onClick={this.reset}>Send to another device</a>
        </Localized>
      </div>

    );
  }

  validateRecipient = (value: string) => {
    if (this.state.allowSMS) {
      return (isValidNumber(value, this.state.country) || validate(value));
    }
    return validate(value);
  }

  handleRecipientChange = (evt: Object) => {
    if (!this.state.submitAttempted) {
      return this.setState({
        recipient: evt.currentTarget.value
      });
    }

    return this.setState({
      isError: !this.validateRecipient(evt.currentTarget.value),
      recipient: evt.currentTarget.value
    });
  }

  renderForm = () => {
    const { allowSMS, isError, submitAttempted } = this.state;

    const errorId = allowSMS ? "mobileDialogErrorSMS" : "mobileDialogError";
    const errorText = allowSMS ? "Enter a valid phone number or email:" : "Enter a valid email:";
    const instructionId = allowSMS ? "mobileDialogInstructionsSMS" : "mobileDialogInstructions";
    const instructionText = allowSMS ? "Enter your phone number or email to send a download link to your phone:" : "Enter your email to send a download link to your phone:";

    return (
      <form className="mobile-link-form" data-no-csrf onSubmit={this.handleSubscribe}>
        {!submitAttempted && <Localized id={instructionId}>
          <p className="instruction">{instructionText}</p>
        </Localized>}

        {submitAttempted && isError && <Localized id={errorId}>
          <p className="error">{errorText}</p>
        </Localized>}

        {allowSMS && // <Localized id="mobileDialogPlaceholderSMS" attrs={{placeholder: true}}>
          <input
            className={classnames({"input-error": isError && submitAttempted})}
            type="text"
            placeholder="Enter your Phone/Email"
            value={this.state.recipient}
            onChange={this.handleRecipientChange} />
        // </Localized>
        }

        {!allowSMS && // <Localized id="mobileDialogPlaceholder" attrs={{placeholder: true}}>
          <input
            className={classnames({"input-error": isError && submitAttempted})}
            type="text"
            placeholder="Enter your Email"
            value={this.state.recipient}
            onChange={this.handleRecipientChange} />
        // </Localized>
        }

        <Localized id="mobileDialogButton">
          <button className={"button large default"}>Send me the Download Link</button>
        </Localized>
      </form>
    );
  }

  focusModalContainer() {
    if (!this.modalContainer) {
      return;
    }
    this.modalContainer.focus();
  }

  handleSubscribe = (evt: Object) => {
    evt.preventDefault();

    const { allowSMS, recipient, country } = this.state;
    const { sendToGA, getWindowLocation } = this.props;
    const basketMsgId = this.props.experiment.basket_msg_id;
    const source = "" + getWindowLocation();

    // return early and show errors if submit attempt fails
    if (!this.validateRecipient(recipient)) return this.setState({submitAttempted: true, isError: true});

    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "Send link to device"
    });

    if (allowSMS && isValidNumber(recipient, country)) {
      // country, lang, msgId
      return subscribeToBasketSMS(recipient, country, basketMsgId).then(response => {
        if (response.ok) {
          sendToGA("event", {
            eventCategory: "ExperimentDetailsPage Interactions",
            eventAction: "button click",
            eventLabel: "link sent to phone"
          });
        }
        this.setState({
          isSuccess: response.ok,
          isError: !response.ok
        });
      });
    }

    return subscribeToBasket(recipient, source).then(response => {
      if (response.ok) {
        sendToGA("event", {
          eventCategory: "ExperimentDetailsPage Interactions",
          eventAction: "button click",
          eventLabel: "link sent to email"
        });
      }
      this.setState({
        isSuccess: response.ok,
        isError: !response.ok
      });
    });
  }

  reset = (e: Object) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(DEFAULT_STATE);
    this.fetchCountryCode();
  }

  close = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
      this.props.sendToGA("event", {
        eventCategory: "ExperimentDetailsPage Interactions",
        eventAction: "button click",
        eventLabel: "cancel Send link to device dialog"
      });
    }
  }

  handleKeyDown(e: Object) {
    if (e.key === "Escape") this.close();
  }
}
