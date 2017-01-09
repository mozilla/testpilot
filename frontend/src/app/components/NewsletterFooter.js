import classnames from 'classnames';
import React, { PropTypes } from 'react';

import NewsletterForm from './NewsletterForm';


export default class NewsletterFooter extends React.Component {
  renderError() {
    if (this.props.newsletterForm.failed) {
      return (
        <div className="error" data-l10n-id="newsletterFooterError">
          There was an error submitting your email address. Try again?
        </div>
      );
    }
    return null;
  }

  renderSuccess() {
    return (
      <header className="success-header">
        <h2 data-l10n-id="newsletterFooterSuccessHeader">Thanks!</h2>
        <p data-l10n-id="newsletterFooterSuccessBody">
          If you haven't previously confirmed a subscription to a Mozilla-related
          newsletter you may have to do so. Please check your inbox or your spam
          filter for an email from us.
        </p>
      </header>
    );
  }

  renderHeader() {
    if (this.props.newsletterForm.succeeded) {
      return this.renderSuccess();
    }

    return (
      <header>
        <h2 data-l10n-id="newsletterFooterHeader">Stay Informed</h2>
        <p data-l10n-id="newsletterFooterBody">
          Find out about new experiments and see test results for experiments
          you've tried.
        </p>
      </header>
    );
  }

  getClassNames() {
    return classnames('newsletter-footer', {
      success: this.props.newsletterForm.succeeded
    });
  }

  render() {
    return (
      <div className={this.getClassNames()}>
        <section className="responsive-content-wrapper">
          {this.renderError()}
          {this.renderHeader()}
          <NewsletterForm {...this.props.newsletterForm} locale={this.props.locale} />
        </section>
      </div>
    );
  }
}

NewsletterFooter.propTypes = {
  locale: PropTypes.string.isRequired
};
