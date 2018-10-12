// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { defaultState } from "../../reducers/newsletter-form";

import "./index.scss";

type NewsletterFormProps = {
  submitting?: boolean,
  email?: string,
  privacy?: boolean,
  isModal?: boolean,
  subscribe?: Function,
  setEmail?: Function,
  setPrivacy?: Function,
  buttonRef?: Function
}

export default class NewsletterForm extends Component<NewsletterFormProps> {
  handleEmailChange: Function
  handlePrivacyChange: Function
  handleSubmit: Function

  static defaultProps = defaultState();

  constructor(props: NewsletterFormProps) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  makeRevealedClassNames() {
    return classnames("revealed-field", {
      reveal: !!this.props.email
    });
  }

  handleEmailChange(evt: Object) {
    if (typeof this.props.setEmail !== "undefined") {
      this.props.setEmail(evt.target.value);
    }
  }

  handlePrivacyChange(evt: Object) {
    if (typeof this.props.setPrivacy !== "undefined") {
      this.props.setPrivacy(evt.target.checked);
    }
  }

  renderEmailField() {
    return (
      <Localized id="newsletterFormEmailPlaceholder" attrs={{placeholder: true}}>
        <input
          type='email'
          placeholder="Your email here"
          required
          value={this.props.email}
          onChange={this.handleEmailChange}
        />
      </Localized>
    );
  }

  renderPrivacyField() {
    const fieldName = "privacy";

    return <div>
      <label className={this.makeRevealedClassNames()} htmlFor={fieldName}>
        <input
          name={fieldName}
          id={fieldName}
          type="checkbox"
          checked={this.props.privacy}
          onChange={this.handlePrivacyChange}
          required />
        <Localized id="newsletterFormPrivacyNotice"
          a={<a target="_blank" rel="noopener noreferrer" href="/privacy"/>}>
          <span>
            I&apos;m okay with Mozilla handling my info as explained in <a>this privacy notice</a>.
          </span>
        </Localized>
      </label>
    </div>;
  }

  renderSubmitButton() {
    if (this.props.submitting) {
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

  focusNewsletterFooter() {
    document.querySelectorAll(".newsletter-footer").forEach(el => {
      if (el.offsetTop) {
        window.scrollTo(0, el.offsetTop);
      }
    });
  }

  handleSubmit(evt: Object) {
    evt.preventDefault();
    if (typeof this.props.subscribe !== "undefined") {
      this.props.subscribe(this.props.email);
      this.focusNewsletterFooter();
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
