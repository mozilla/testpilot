import classnames from 'classnames';
import React, { PropTypes } from 'react';

import { initialState } from '../reducers/newsletter-form';


export default class NewsletterForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePrivacyClick = this.handlePrivacyClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  makeRevealedClassNames() {
    return classnames('revealed-field', {
      reveal: !!this.props.email
    });
  }

  handleEmailChange(evt) {
    this.props.setEmail(evt.target.value);
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

  handlePrivacyClick(evt) {
    this.props.setPrivacy(evt.target.checked);
  }

  renderPrivacyField() {
    const fieldName = 'privacy';
    const url = '/privacy';

    return (
      <label className={this.makeRevealedClassNames()} htmlFor={fieldName}>
        <input name={fieldName} type="checkbox" checked={this.props.privacy} required
               onClick={this.handlePrivacyClick} />
        <span data-l10n-id="newsletterFormPrivacyNotice">
          I'm okay with Mozilla handling by info as explained in
          <a href={url}>this Privacy Notice</a>.
        </span>
      </label>
    );
  }

  renderSubmitButton() {
    if (this.props.submitting) {
      return (
        <button disabled={true}
                data-l10n-id='newsletterFormSubmitButtonSubmitting'>
          Submitting...
        </button>
      );
    }
    return <button data-l10n-id='newsletterFormSubmitButton'>Sign Up Now</button>;
  }

  renderDisclaimer() {
    return (
      <p className={`disclaimer ${this.makeRevealedClassNames()}`}
         data-l10n-id='newsletterFormDisclaimer'>
        We will only send you Test Pilot-related information.
      </p>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.subscribe(this.props.email);
  }

  render() {
    return (
      <form className='newsletter-form' onSubmit={this.handleSubmit}>
        {this.renderEmailField()}
        {this.renderPrivacyField()}
        {this.renderSubmitButton()}
        {this.renderDisclaimer()}
      </form>
    );
  }
}

NewsletterForm.defaultProps = initialState;
NewsletterForm.propTypes = {
  email: PropTypes.string.isRequired,
  privacy: PropTypes.bool.isRequired,
  subscribe: PropTypes.func,
  setEmail: PropTypes.func,
  setPrivacy: PropTypes.func
};
