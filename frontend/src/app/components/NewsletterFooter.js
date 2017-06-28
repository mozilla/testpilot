// @flow
import classnames from 'classnames';
import { Localized } from 'fluent-react';
import React from 'react';

import LayoutWrapper from './LayoutWrapper';
import NewsletterForm from './NewsletterForm';

type NewsletterFooterProps = {
  getWindowLocation: Function,
  newsletterForm: {
    failed: boolean,
    succeeded: boolean
  }
}

export default class NewsletterFooter extends React.Component {
  props: NewsletterFooterProps

  renderError() {
    if (this.props.newsletterForm.failed) {
      return (
        <Localized id="newsletterFooterError">
          <div className="error">
            There was an error submitting your email address. Try again?
          </div>
        </Localized>
      );
    }
    return null;
  }

  renderSuccess() {
    return (
      <header className="success-header">
        <Localized id="newsletterFooterSuccessHeader">
          <h2>Thanks!</h2>
        </Localized>
        <Localized id="newsletterFooterSuccessBody">
          <p>
            If you haven&apos;t previously confirmed a subscription to a Mozilla-related
            newsletter you may have to do so. Please check your inbox or your spam
            filter for an email from us.
          </p>
        </Localized>
      </header>
    );
  }

  renderHeader() {
    if (this.props.newsletterForm.succeeded) {
      return this.renderSuccess();
    }

    return (
      <header>
        <Localized id="newsletterFooterHeader">
          <h2>Stay Informed</h2>
        </Localized>
        <Localized id="newsletterFooterBody">
          <p>
            Find out about new experiments and see test results for experiments
            you&apos;ve tried.
          </p>
        </Localized>
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
        <LayoutWrapper flexModifier="column-center">
          {this.renderError()}
          <LayoutWrapper flexModifier="row-between-breaking">
            {this.renderHeader()}
            <NewsletterForm {...this.props.newsletterForm} />
          </LayoutWrapper>
        </LayoutWrapper>
      </div>
    );
  }
}
