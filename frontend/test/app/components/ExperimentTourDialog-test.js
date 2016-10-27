import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import ExperimentTourDialog from '../../../src/app/components/ExperimentTourDialog';

describe('app/components/ExperimentTourDialog', () => {
  let props, mockClickEvent, subject;
  beforeEach(() => {
    mockClickEvent = { preventDefault: sinon.spy() };

    props = {
      experiment: {
        title: 'Test Experiment',
        slug: 'test',
        tour_steps: [
          { image: '/example1.png', copy: '<p class="example1">Example 1</p>', copy_l10nid: 'foo' },
          { image: '/example2.png', copy: '<p class="example2">Example 2</p>' },
          { image: '/example3.png', copy: '<p class="example3">Example 3</p>' },
        ]
      },
      sendToGA: sinon.spy(),
      onComplete: sinon.spy(),
      onCancel: sinon.spy()
    };

    subject = shallow(<ExperimentTourDialog {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('should render expected default content', () => {
    expect(JSON.parse(findByL10nID('tourOnboardingTitle').prop('data-l10n-args')).title)
      .to.equal(props.experiment.title);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);
  });

  it('should have the correct l10n IDs', () => {
    expect(subject.find('.tour-text').prop('data-l10n-id')).to.equal('testTourstep0Foo');
  });

  it('should advance one step and ping GA when the next button is clicked', () => {
    subject.find('.tour-next').simulate('click', mockClickEvent);

    const expectedTourStep = props.experiment.tour_steps[1];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(1);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `forward to step 1`
    }]);
  });

  it('should rewind one step and ping GA when the back button is clicked', () => {
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.true;
    subject.setState({ currentStep: 1 });
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.false;

    subject.find('.tour-back').simulate('click', mockClickEvent);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(0);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `back to step 0`
    }]);
  });

  it('should render dots to indicate and choose tour steps', () => {
    expect(subject.find('.tour-image .dot'))
      .to.have.property('length', props.experiment.tour_steps.length);

    subject.setState({ currentStep: 2 });
    expect(subject.find('.tour-image .dot').at(2).hasClass('current')).to.be.true;

    subject.find('.tour-image .dot').at(0).simulate('click', mockClickEvent);

    expect(subject.state('currentStep')).to.equal(0);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `dot to step 0`
    }]);
  });

  it('should ping GA and call onCancel when cancel button clicked', () => {
    subject.find('.tour-cancel').simulate('click', mockClickEvent);

    expect(props.onCancel.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    }]);
  });

  it('should ping GA and call onComplete when done button clicked', () => {
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.false;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.true;
    subject.setState({ currentStep: 2 });
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.true;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.false;

    subject.find('.tour-done').simulate('click', mockClickEvent);

    expect(props.onComplete.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    }]);
  });
});
