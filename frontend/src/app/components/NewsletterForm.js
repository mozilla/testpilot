import classnames from 'classnames';
import React, { PropTypes } from 'react';

import { defaultState } from '../reducers/newsletter-form';


export default class NewsletterForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePrivacyClick = this.handlePrivacyClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      privacyNote: ''
    };
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
        { this.state.privacyNote ? <span data-l10n-id="newsletterFormPrivacyAgreementRequired" style={{ color: 'red', marginRight: '0.5em' }}></span> : null }
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
        <button disabled={true} className="button outline large"
                data-l10n-id='newsletterFormSubmitButtonSubmitting'>
          Submitting...
        </button>
      );
    }
    return <button data-l10n-id='newsletterFormSubmitButton' className="button outline large">Sign Up Now</button>;
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
    if (!this.props.privacy) {
      this.setState({ privacyNote: true });
    } else {
      this.setState({ privacyNote: false });
      this.props.subscribe(this.props.email, this.props.locale);
    }
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

NewsletterForm.defaultProps = defaultState();
NewsletterForm.propTypes = {
  email: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  privacy: PropTypes.bool.isRequired,
  subscribe: PropTypes.func,
  setEmail: PropTypes.func,
  setPrivacy: PropTypes.func
};
