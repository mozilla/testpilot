import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import ExperimentDisableDialog from '../../../src/app/components/ExperimentDisableDialog';

describe('app/components/ExperimentDisableDialog', () => {
  const experiment = { title: 'foobar', survey_url: 'https://example.com' };
  const installed = { ex1: true, ex2: true };
  const clientUUID = '38c51b84-9586-499f-ac52-94626e2b29cf';

  let onSubmit, onCancel, sendToGA, preventDefault, mockClickEvent, subject;
  beforeEach(function() {
    onSubmit = sinon.spy();
    onCancel = sinon.spy();
    sendToGA = sinon.spy();
    preventDefault = sinon.spy();
    mockClickEvent = { preventDefault };
    subject = shallow(
      <ExperimentDisableDialog
        experiment={experiment} installed={installed}
        onSubmit={onSubmit} onCancel={onCancel}
        clientUUID={clientUUID} sendToGA={sendToGA} />
    );
  });

  it('should render a modal container', () => {
    expect(subject.find('.modal-container')).to.have.property('length', 1);
    expect(subject.find('.modal-header').props()['data-l10n-args'])
      .to.equal(JSON.stringify({ title: experiment.title }));
  });

  it('should call onCancel when cancel button clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.true;
    expect(preventDefault.called).to.be.true;
  });

  it('should launch a survey when submit button clicked', () => {
    const submitLink = subject.find('.modal-actions a.submit');
    const expectedHref = 'https://example.com?ref=disable&experiment=foobar&cid=38c51b84-9586-499f-ac52-94626e2b29cf&installed=ex1&installed=ex2';

    expect(submitLink.props().href).to.equal(expectedHref);

    submitLink.simulate('click', mockClickEvent);
    expect(onSubmit.called).to.be.true;
    expect(preventDefault.called).to.be.false;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'exit survey disabled'
    }]);
  });
});
