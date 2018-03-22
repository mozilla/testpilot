// @flow
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import LayoutWrapper from "../LayoutWrapper";
import NewsletterForm from "../NewsletterForm";
import { subscribeToBasket } from "../../lib/utils";

import "./index.scss";

type NewsletterFooterProps = {
  getWindowLocation: Function,
  sendToGA: Function
}

type NewsletterFooterState = {
  isSuccess: boolean,
  isError: boolean,
  isSubmitting: boolean
}

export default class NewsletterFooter extends React.Component {
  props: NewsletterFooterProps
  state: NewsletterFooterState

  constructor(props: NewsletterFooterProps) {
    super(props);
    this.state = {
      isSuccess: false,
      isError: false,
      isSubmitting: false
    };
  }

  renderError() {
    if (this.state.isError) {
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
    if (this.state.isSuccess) {
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
    return classnames("newsletter-footer", {
      success: this.state.isSuccess
    });
  }

  handleSubscribe(email: string) {
    const { sendToGA } = this.props;
    const source = "" + this.props.getWindowLocation();

    sendToGA("event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "Sign me up"
    });
    this.setState({isSubmitting: true, isSuccess: false, isError: false});
    subscribeToBasket(email, source).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      this.setState({isSuccess: true, isSubmitting: false});
      sendToGA("event", {
        eventCategory: "HomePage Interactions",
        eventAction: "footer newsletter form success",
        eventLabel: "email submitted to basket"
      });
    })
      .catch(err => {
        this.setState({isSuccess: false, isError: true, isSubmitting: false});
        sendToGA("event", {
          eventCategory: "HomePage Interactions",
          eventAction: "footer newsletter form submit",
          eventLabel: "email failed to submit to basket"
        });
      });
  }

  render() {
    return (
      <div className={this.getClassNames()}>
        <LayoutWrapper flexModifier="column-center">
          {this.renderError()}
          <LayoutWrapper flexModifier="row-between-breaking">
            {this.renderHeader()}
            <NewsletterForm subscribe={this.handleSubscribe.bind(this)} isSubmitting={this.state.isSubmitting} />
          </LayoutWrapper>
        </LayoutWrapper>
      </div>
    );
  }
}
