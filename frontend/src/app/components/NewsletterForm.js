// @flow

import classnames from 'classnames';
import React from 'react';

import { defaultState } from '../reducers/newsletter-form';

type NewsletterFormProps = {
  email?: string,
  privacy?: boolean,
  isModal?: boolean,
  subscribe?: Function,
  setEmail?: Function,
  setPrivacy?: Function
}

type NewsletterFormState = {
  privacyNote: boolean
}

export default class NewsletterForm extends React.Component {
  props: NewsletterFormProps
  state: NewsletterFormState
  handleEmailChange: Function
  handlePrivacyClick: Function
  handleSubmit: Function

  static defaultProps = defaultState();

  constructor(props: NewsletterFormProps) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePrivacyClick = this.handlePrivacyClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      privacyNote: false
    };
  }

  makeRevealedClassNames() {
    return classnames('revealed-field', {
      reveal: !!this.props.email
    });
  }

  handleEmailChange(evt: Object) {
    if (typeof this.props.setEmail !== 'undefined') {
      this.props.setEmail(evt.target.value);
    }
  }

  renderEmailField() {
    return (
      <input
        type='email'
        required data-l10n-id='newsletterFormEmailPlaceholder'
        placeholder='Your email here'
        value={this.props.email}
        onChange={this.handleEmailChange}
      />
    );
  }

  handlePrivacyClick(evt: Object) {
    if (typeof this.props.setPrivacy !== 'undefined') {
      this.props.setPrivacy(evt.target.checked);
    }
  }

  renderPrivacyField() {
    const fieldName = 'privacy';
    const url = '/privacy';

    return (
      <label className={this.makeRevealedClassNames()} htmlFor={fieldName}>
        <input name={fieldName} id={fieldName} type="checkbox" checked={this.props.privacy} required
               onChange={this.handlePrivacyClick} onClick={this.handlePrivacyClick} />
        { this.state.privacyNote ? <span data-l10n-id="newsletterFormPrivacyAgreementRequired"></span> : null }
        <span data-l10n-id="newsletterFormPrivacyNotice">
          I&apos;m okay with Mozilla handling by info as explained in
          <a target="_blank" rel="noopener noreferrer"
            href={url}>
            this Privacy Notice
          </a>.
        </span>
      </label>
    );
  }

  renderSubmitButton() {
    if (this.props.submitting) {
      return (
        <button disabled={true} className="button outline large"
                data-l10n-id='newsletterFormSubmitButtonSubmitting'>
          Submitting...
        </button>
      );
    }
    return <button data-l10n-id='newsletterFormSubmitButton' className={classnames('button', 'large', this.props.isModal ? 'default' : 'outline')}>Sign Up Now</button>;
  }

  renderDisclaimer() {
    return (
      <p className="disclaimer"
         data-l10n-id='newsletterFormDisclaimer'>
        We will only send you Test Pilot-related information.
      </p>
    );
  }

  handleSubmit(evt: Object) {
    evt.preventDefault();
    if (!this.props.privacy) {
      this.setState({ privacyNote: true });
    } else {
      this.setState({ privacyNote: false });
      if (typeof this.props.subscribe !== 'undefined') {
        this.props.subscribe(this.props.email);
      }
    }
  }

  render() {
    return (
      <form className={ classnames('newsletter-form', { 'newsletter-form-modal': this.props.isModal }) }
            onSubmit={this.handleSubmit} data-no-csrf>
        {this.renderEmailField()}
        {this.renderPrivacyField()}
        {this.renderSubmitButton()}
        {this.renderDisclaimer()}
      </form>
    );
  }
}
