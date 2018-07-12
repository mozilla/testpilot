// @flow
import React from "react";
import classnames from "classnames";
// $FlowFixMe
import { isValidNumber } from "libphonenumber-js";
// $FlowFixMe
import { validate } from "email-validator";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../LocalizedHtml";
import Loading from "../Loading";

import "./index.scss";

import iconIos from "../../../images/ios-light.svg";
import iconGoogle from "../../../images/google-play.png";

import { subscribeToBasket, subscribeToBasketSMS, acceptedSMSCountries } from "../../lib/utils";

type MobileDialogProps = {
  getWindowLocation: Function,
  onCancel: Function,
  sendToGA: Function,
  experiment: Object,
  fetchCountryCode: Function,
  fromFeatured?: boolean
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
    this.props.fetchCountryCode()
      .then((resp) => resp.json())
      .then((data) => {
        const country = data.country_code;
        if (acceptedSMSCountries.includes(country)) {
          this.setState({
            loading: false,
            allowSMS: true,
            country: country
          });
        } else this.setState({ loading: false });
      }).catch((e) => this.setState({ loading: false }));
  }

  render() {
    const { experiment, sendToGA, fromFeatured } = this.props;
    const { title, android_url, ios_url } = experiment;
    const { isSuccess, allowSMS, loading } = this.state;

    const handleAppLinkClick = () => {
      const platform = ios_url ? "ios" : "android";
      sendToGA("event", {
        eventCategory: "SMS Modal Interactions",
        eventAction: "mobile store click",
        eventLabel: `${platform}`,
        dimension11: experiment.slug,
        dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
      });
    };

    const headerMessage = ios_url ? (<LocalizedHtml id="mobileDialogMessageIOS" $title={title}>
      <p>Download <b>{title}</b> from the iOS App Store.</p></LocalizedHtml>) : (<LocalizedHtml id="mobileDialogMessageAndroid" $title={title}><p>Download <b>{title}</b> from the Google Play Store.</p></LocalizedHtml>);
    const headerImg = ios_url ? (<a href={ios_url} onClick={handleAppLinkClick} target="_blank" rel="noopener noreferrer"><img className="mobile-header-img" src={iconIos}/></a>) : (<a href={android_url} onClick={handleAppLinkClick} target="_blank" rel="noopener noreferrer"><img className="mobile-header-img" src={iconGoogle}/></a>);

    const learnMoreLink = "https://www.mozilla.org/privacy/websites/#campaigns";

    const learnMore = (<Localized id="mobileDialogNoticeLearnMoreLink">
      <a target="_blank" rel="noopener noreferrer" href={learnMoreLink}>Learn More</a>
    </Localized>);

    const privacy = (<Localized id="newsletterFormPrivacyNoticePrivacyLink">
      <a target="_blank" rel="noopener noreferrer" href={learnMoreLink} />
    </Localized>);

    const notice = allowSMS ? (<Localized id="mobileDialogNoticeSMS" $learnMore={learnMore}><p className="notice">SMS service available in select countries only. SMS & data rates may apply. The intended recipient of the email or SMS must have consented. {learnMore}</p></Localized>)
      : (<LocalizedHtml id="newsletterFormPrivacyNotice" $privacy={privacy}>
        <p className="notice">
        I&apos;m okay with Mozilla handling my info as explained in {privacy}.
        </p>
      </LocalizedHtml>
      );

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
    const { sendToGA, getWindowLocation, fromFeatured, experiment } = this.props;
    const basketMsgId = `txp-${this.props.experiment.slug}`;
    const source = "" + getWindowLocation();

    // return early and show errors if submit attempt fails
    if (!this.validateRecipient(recipient)) return this.setState({submitAttempted: true, isError: true});

    if (allowSMS && isValidNumber(recipient, country)) {
      sendToGA("event", {
        eventCategory: "SMS Modal Interactions",
        eventAction: "mobile link request",
        eventLabel: "sms",
        dimension11: experiment.slug,
        dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
      });
      // country, lang, msgId
      return subscribeToBasketSMS(recipient, country, basketMsgId).then(response => {
        sendToGA("event", {
          eventCategory: "SMS Modal Interactions",
          eventAction: "request handled",
          eventLabel: response.ok ? "success" : "error",
          dimension11: experiment.slug,
          dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
        });
        this.setState({
          isSuccess: response.ok,
          isError: !response.ok
        });
      });
    }

    sendToGA("event", {
      eventCategory: "SMS Modal Interactions",
      eventAction: "mobile link request",
      eventLabel: "email",
      dimension11: experiment.slug,
      dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
    });

    return subscribeToBasket(recipient, source, basketMsgId).then(response => {
      sendToGA("event", {
        eventCategory: "SMS Modal Interactions",
        eventAction: "request handled",
        eventLabel: response.ok ? "success" : "error",
        dimension11: experiment.slug,
        dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
      });

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
    const { onCancel, sendToGA, fromFeatured, experiment } = this.props;
    if (onCancel) {
      onCancel();
      sendToGA("event", {
        eventCategory: "SMS Modal Interactions",
        eventAction: "dialog dismissed",
        eventLabel: "cancel Send link to device dialog",
        dimension11: experiment.slug,
        dimension13: fromFeatured ? "Featured Experiment" : "Experiment Detail"
      });
    }
  }

  handleKeyDown(e: Object) {
    if (e.key === "Escape") this.close();
  }
}
