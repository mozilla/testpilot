import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import EmailDialog from '../../../src/app/components/EmailDialog';

describe('app/components/EmailDialog', () => {

  const mockClickEvent = {
    preventDefault() {},
    stopPropagation() {}
  };

  let onDismiss, sendToGA, subscribeToBasket, subject;
  beforeEach(() => {
    onDismiss = sinon.spy();
    sendToGA = sinon.spy();
    subscribeToBasket = sinon.spy();
    subject = shallow(<EmailDialog onDismiss={onDismiss}
                                   sendToGA={sendToGA}
                                   subscribeToBasket={subscribeToBasket} />);
  });

  it('should render a modal container', () => {
    expect(subject.find('.modal-container')).to.have.property('length', 1);
  });

  it('should dismiss when skip is clicked', () => {
    subject.find('.modal-actions a.cancel').simulate('click', mockClickEvent);

    expect(onDismiss.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Skip email'
    }]);
  });

  it('should show validation error on invalid email when submit clicked', () => {
    subject.setState({ email: 'this is a terrible email' });
    subject.find('.modal-actions button.submit').simulate('click', mockClickEvent);

    expect(subject.state('isValidEmail')).to.be.false;
    expect(onDismiss.called).to.be.false;
  });

  it('should subscribe to basket on valid email when submit clicked', () => {
    const expectedEmail = 'me@a.b.com';
    const expectedLocale = 'en';
    subject.setState({ email: expectedEmail });
    subject.setState({ locale: expectedLocale });
    subject.find('.modal-actions button.submit').simulate('click', mockClickEvent);

    expect(subject.state('isValidEmail')).to.be.true;
    expect(subject.state('isFirstPage')).to.be.false;

    expect(subscribeToBasket.called).to.be.true;
    expect(subscribeToBasket.lastCall.args[0]).to.equal(expectedEmail);

    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    }]);

    // Fake the callback from fetch()
    const cb = subscribeToBasket.lastCall.args[2];
    expect(cb).to.be.a('function');
    cb();

    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'email submitted to basket'
    }]);
  });

  it('should dismiss when continue button is clicked after subscribe', () => {
    subject.setState({ isValidEmail: true, isFirstPage: false });

    const message = subject.findWhere(el => 'emailOptInSuccessMessage2' === el.props()['data-l10n-id']);
    expect(message).to.have.length(1);

    const button = subject.findWhere(el => 'continue' === el.props()['data-hook']);
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
