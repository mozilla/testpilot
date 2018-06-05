// @flow
import { Localized } from "fluent-react/compat";
import React from "react";
import { isValidNumber } from "libphonenumber-js";
import { validate } from "email-validator";
import Loading from "../../components/Loading";

import { subscribeToBasket, subscribeToBasketSMS, acceptedSMSCountries } from "../../lib/utils";

const LOCATION_SERVICES_URL = "https://location.services.mozilla.com/v1/country";
const LOCATION_SERVICES_API_KEY = "ae6d80f83cac4f3797f3cd2e309d4fb8";

/* TODO:
- add instructions
- fix input localization
- learn more notice links

- only show input validation after first submission attempt
- make sure that errors don't make the form jump too much

- add link to play store or app store for image

- style send link to device button in ExperimentControls and add render logic for it
- figure out best way to handle location service api key

- fill in acceptedSMSCountries list and verify them
- style everything to the spec
- add tests for allowSMS and non states
- add tests for android and ios states
- document what fields need to be present in order to show button/modal
- sync with john/sevaan about getting the correct urls for android
*/

type MobileDialogProps = {
  getWindowLocation: Function,
  onCancel: Function,
  sendToGA: Function
}

type MobileDialogState = {
  loading: boolean,
  isSuccess: boolean,
  isError: boolean,
  allowSMS: boolean,
  recipient: string,
  country: string
}

const DEFAULT_STATE = {
  loading: true,
  isSuccess: false,
  isError: false,
  allowSMS: false,
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
    // we use XMLHttpRequest here over
    // fetch country code, set it in state and set loading to false
    const req = new XMLHttpRequest();
    req.onerror = (e) => {
      console.log("Country code fetch error", req.statusText, e.target.response);
      this.setState({ loading: false });
    };

    req.onload = (e) => {
      const country = e.target.response.country_code;
      if (acceptedSMSCountries.includes(country)) {
        this.setState({
          loading: false,
          allowSMS: true,
          country: e.target.response.country_code
        });
      } else this.setState({ loading: false });
    };
    req.open("GET", `${LOCATION_SERVICES_URL}?key=${LOCATION_SERVICES_API_KEY}`);
    req.responseType = "json";
    req.send();
  }

  render() {
    const { isSuccess, allowSMS, loading } = this.state;
    const isIOS = false;
    // const { isIOS, experiment } = this.props;
    // const { title } = experiment;
    const title = "Send";

    const headerMessage = isIOS ? (<Localized id="mobileDialogMessageIOS" $title={title}>
      <p>Download {title} from the iOS App Store.</p></Localized>) : (<Localized id="mobileDialogMessageAndroid" $title={title}><p>Download {title} from the Google Play Store.</p></Localized>);

    const headerImg = isIOS ? (<img className="mobile-header-img" src="/static/images/ios.svg"/>) : (<img className="mobile-header-img" src="/static/images/google-play.png"/>);

    const notice = allowSMS ? (<Localized id="mobileDialogNoticeSMS"><p>SMS service available in select countries only. SMS & data rates may apply. The intended recipient of the email or SMS must have consented. <a>Learn more</a></p></Localized>)
      : (<Localized id="mobileDialogNotice"><p>The intended recipient of the email must have consented. <a>Learn more</a></p></Localized>);

    return (
      <div className="modal-container mobile-modal" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
      onKeyDown={e => this.handleKeyDown(e)}>
        <div className="modal feedback-modal modal-bounce-in">
          <header className="modal-header-wrapper">
            <Localized id="mobileDialogTitle">
              <h3 className="modal-header">Get the App</h3>
            </Localized>
            <div className="modal-cancel" onClick={e => this.skip(e)}/>
          </header>
          <div className="modal-content centered">
            {headerMessage}
            {headerImg}
            <hr/>
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
      <div>
        <Localized id="mobileDialogSuccessMain">
          <p className="success primary">Download link sent!</p>
        </Localized>
        <Localized id={secondaryId}>
          <p className="success primary">{secondaryText}</p>
        </Localized>
        <Localized id="mobileDialogButtonSuccess">
          <button className="button large default" onClick={this.close}>Thanks!</button>
        </Localized>
        <Localized id="mobileDialogAnotherDeviceLink">
          <a href="#" className="default blue" onClick={this.reset}>Send to another device</a>
        </Localized>
      </div>

    );
  }

  validateRecipient = (value) => {
    if (this.state.allowSMS) {
      return (isValidNumber(value, this.state.country) || validate(value));
    }
    return validate(value);
  }

  handleRecipientChange = (evt: Object) => {
    this.setState({
      isError: !this.validateRecipient(evt.currentTarget.value),
      recipient: evt.currentTarget.value
    });
  }

  renderForm = () => {
    const { allowSMS } = this.state;
    // const placeholderId = allowSMS ? "mobileDialogPlaceholderSMS" : "mobileDialogPlaceholder";
    const placeholderText = allowSMS ? "Enter your Phone/Email" : "Enter your Email";
    const errorId = allowSMS ? "mobileDialogErrorSMS" : "mobileDialogError";
    const errorText = allowSMS ? "Enter a valid phone number or email:" : "Enter a valid email:";

    console.log("renderform:::", // placeholderId,
                placeholderText, errorId, errorText);
    // <Localized id={placeholderId} attrs={{placeholder: true}}>          </Localized>
    return (
      <form className="mobile-link-form" data-no-csrf onSubmit={this.handleSubscribe}>
        {this.state.isError && <Localized id={errorId}>
          <p className="error">{errorText}</p>
        </Localized>}
          <input
            type='text'
            placeholder={placeholderText}
            required
            value={this.props.recipient}
            onChange={this.handleRecipientChange}
            />        

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
    console.log("handleSubscribe", evt);
    const { allowSMS, recipient, country } = this.state;
    const { sendToGA } = this.props;
    const source = "" + this.props.getWindowLocation();

    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "Send link to device"
    });

    if (allowSMS && isValidNumber(recipient, country)) {
      // country, lang, msgId
      subscribeToBasketSMS(recipient, country, null, null).then(response => {
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
    } else {
      subscribeToBasket(recipient, source).then(response => {
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
  }

  reset = (e: Object) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(DEFAULT_STATE);
    this.fetchCountryCode();
  }

  close() {
    if (this.props.onCancel) { this.props.onCancel(); }
  }

  handleKeyDown(e: Object) {
    if (e.key === "Escape") this.close();
  }

}
