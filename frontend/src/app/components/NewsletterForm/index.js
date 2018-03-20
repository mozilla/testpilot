// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import LocalizedHtml from "../LocalizedHtml";

import "./index.scss";

type NewsletterFormProps = {
  isSubmitting?: boolean,
  isModal?: boolean,
  subscribe?: Function,
  buttonRef?: Function
}

type NewsletterFormState = {
  email: string
}

export default class NewsletterForm extends React.Component {
  props: NewsletterFormProps
  handleEmailChange: Function
  handleSubmit: Function
  state: NewsletterFormState

  constructor(props: NewsletterFormProps) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: ""
    };
  }

  makeRevealedClassNames() {
    return classnames("revealed-field", {
      reveal: !!this.state.email
    });
  }

  handleEmailChange(evt: Object) {
    this.setState({email: evt.target.value});
  }

  renderEmailField() {
    return (
      <Localized id="newsletterFormEmailPlaceholder" attrs={{placeholder: true}}>
        <input
          type='email'
          placeholder="Your email here"
          required
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
      </Localized>
    );
  }

  renderPrivacyField() {
    const fieldName = "privacy";
    const privacy = <Localized id="newsletterFormPrivacyNoticePrivacyLink">
      <a target="_blank" rel="noopener noreferrer"
        href="/privacy"/>
    </Localized>;

    return <div>
      <label className={this.makeRevealedClassNames()} htmlFor={fieldName}>
        <input name={fieldName} id={fieldName} type="checkbox" required />
        <LocalizedHtml id="newsletterFormPrivacyNotice" $privacy={privacy}>
          <span>
            I&apos;m okay with Mozilla handling my info as explained in {privacy}.
          </span>
        </LocalizedHtml>
      </label>
    </div>;
  }

  renderSubmitButton() {
    if (this.props.isSubmitting) {
      return (
        <Localized id='newsletterFormSubmitButtonSubmitting'>
          <button disabled={true} className="button outline large newsletter-form-submitting">
            Submitting...
          </button>
        </Localized>
      );
    }
    return <Localized id='newsletterFormSubmitButton'>
      <button className={classnames("button", "large", this.props.isModal ? "default" : "outline")}
        ref={this.props.buttonRef}>Sign Up Now</button>
    </Localized>;
  }

  renderDisclaimer() {
    return (
      <Localized id='newsletterFormDisclaimer'>
        <p className="disclaimer">
          We will only send you Test Pilot-related information.
        </p>
      </Localized>
    );
  }

  handleSubmit(evt: Object) {
    evt.preventDefault();
    if (typeof this.props.subscribe !== "undefined") {
      this.props.subscribe(this.state.email);
    }
  }

  render() {
    return (
      <form className={ classnames("newsletter-form", { "newsletter-form-modal": this.props.isModal }) }
        onSubmit={this.handleSubmit} data-no-csrf>
        {this.renderEmailField()}
        {this.renderPrivacyField()}
        {this.renderSubmitButton()}
        {this.renderDisclaimer()}
      </form>
    );
  }
}
