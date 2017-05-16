import fetchMock from 'fetch-mock';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import EmailDialog from '../../../src/app/components/EmailDialog';
import { basketUrl } from '../../../src/app/lib/utils';

describe('app/components/EmailDialog', () => {

  const mockLocation = 'https://example.com';

  const mockClickEvent = {
    preventDefault() {},
    stopPropagation() {}
  };

  let onDismiss, sendToGA, getWindowLocation, subject;
  beforeEach(() => {
    fetchMock.restore();
    onDismiss = sinon.spy();
    sendToGA = sinon.spy();
    getWindowLocation = sinon.spy(() => mockLocation);
    subject = shallow(<EmailDialog {...{ onDismiss, sendToGA, getWindowLocation }} />);
  });

  it('should render a modal container', () => {
    expect(subject.find('.modal-container')).to.have.property('length', 1);
  });

  it('should dismiss when skip is clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);

    expect(onDismiss.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Skip email'
    }]);
  });

  it('should include a NewsletterForm', () => {
    const form = subject.find('NewsletterForm');
    expect(form).to.have.length(1);
  });

  it('should subscribe to basket on valid email when submit clicked', done => {
    const expectedEmail = 'me@a.b.com';
    subject.setState({ email: expectedEmail });

    fetchMock.post(basketUrl, 200);
    subject.instance().handleSubscribe(expectedEmail);

    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    }]);

    // HACK: Yield for fetch-mock promises to complete, because we don't have
    // direct control over that here.
    setTimeout(() => {
      const [url, request] = fetchMock.lastCall(basketUrl);

      expect(url).to.equal(basketUrl);
      expect(request).to.deep.equal({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'newsletters=test-pilot&email=me%40a.b.com&source_url=https%3A%2F%2Fexample.com'
      });

      expect(subject.state('isSuccess')).to.be.true;
      const message = subject.findWhere(el => 'emailOptInSuccessMessage2' === el.props()['data-l10n-id']);
      expect(message).to.have.length(1);

      expect(sendToGA.lastCall.args).to.deep.equal(['event', {
        eventCategory: 'HomePage Interactions',
        eventAction: 'button click',
        eventLabel: 'email submitted to basket'
      }]);
      done();
    }, 1);
  });

  it('should show an error page on error', done => {
    const expectedEmail = 'me@a.b.com';
    subject.setState({ email: expectedEmail });

    fetchMock.post(basketUrl, 500);
    subject.instance().handleSubscribe(expectedEmail);

    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    }]);

    setTimeout(() => {
      expect(subject.state('isError')).to.be.true;
      const message = subject.findWhere(el => 'newsletterFooterError' === el.props()['data-l10n-id']);
      expect(message).to.have.length(1);
      done();
    }, 1);
  });

  it('should dismiss when continue button is clicked after subscribe', () => {
    subject.setState({ isSuccess: true, isError: false });

    const message = subject.findWhere(el => 'emailOptInSuccessMessage2' === el.props()['data-l10n-id']);
    expect(message).to.have.length(1);

    const button = subject.findWhere(el => 'email-success-continue' === el.props()['id']);
    expect(button).to.have.length(1);

    button.simulate('click', mockClickEvent);
    expect(onDismiss.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'On to the experiments'
    }]);
  });
});
