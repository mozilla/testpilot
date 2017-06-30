import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../util';

import ExperimentPreFeedbackDialog from '../../../src/app/components/ExperimentPreFeedbackDialog';

describe('app/components/ExperimentPreFeedbackDialog', () => {
  const experiment = {
    title: 'foobar',
    survey_url: 'https://example.com/survey',
    pre_feedback_image: '/foo.png',
    pre_feedback_copy: '<p class="expectedCopy">markup works!</p>'
  };
  const surveyURL = experiment.survey_url;

  let sendToGA, onCancel, preventDefault, getAttribute, mockClickEvent, subject;
  beforeEach(function() {
    sendToGA = sinon.spy();
    onCancel = sinon.spy();
    preventDefault = sinon.spy();
    getAttribute = sinon.spy(() => surveyURL);
    mockClickEvent = { preventDefault, target: { getAttribute } };
    subject = shallow(
      <ExperimentPreFeedbackDialog experiment={experiment} surveyURL={surveyURL}
                                   onCancel={onCancel} sendToGA={sendToGA} />
    );
  });

  it('should render expected content', () => {
    expect(subject.find('.modal-container'))
      .to.have.property('length', 1);
    expect(findLocalizedById(subject, 'experimentPreFeedbackTitle').prop('$title'))
      .to.equal(experiment.title);
    expect(findLocalizedById(subject, 'experimentPreFeedbackLinkCopy').prop('$title'))
      .to.equal(experiment.title);
    expect(subject.find('.tour-image img').props().src)
      .to.equal(experiment.pre_feedback_image);
    expect(subject.find('.tour-text').first().html())
      .to.contain(experiment.pre_feedback_copy);
  });

  it('should call onCancel on cancel button click', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel feedback'
    }]);
  });

  it('should launch feedback on feedback button click', () => {
    subject.find('.tour-text a').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.false;
    expect(getAttribute.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: 'foobar',
      outboundURL: surveyURL
    }]);
  });
});
