/* global describe, beforeEach, it */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import { findLocalizedById } from '../../../../test/app/util';

import FeaturedExperiment from './index';

describe('app/components/FeaturedExperiment', () => {
  let mockExperiment, mockClickEvent, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing Experiment',
      subtitle: 'This is a subtitle.',
      subtitle_l10nsuffix: 'foo',
      description: 'This is a description.',
      created: moment().subtract(2, 'months').utc(),
      modified: moment().subtract(2, 'months').utc()
    };
    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    };
    props = {
      experiment: mockExperiment,
      hasAddon: false,
      enabled: false,
      isFirefox: true,
      isMinFirefox: true,
      installed: [],
      eventCategory: 'test category',
      navigateTo: sinon.spy(),
      sendToGA: sinon.spy(),
      getExperimentLastSeen: sinon.spy()
    };
    subject = mount(<FeaturedExperiment {...props} />);
  });

  it('should render expected content', () => {
    expect(subject.find('.featured-information header h2').text()).to.equal(mockExperiment.title);
  });

  it('should have the expected l10n ID', () => {
    expect(findLocalizedById(subject, 'testing')).to.have.property('length', 0);
    expect(findLocalizedById(subject, 'testingSubtitleFoo')).to.have.property('length', 1);
    expect(findLocalizedById(subject, 'testingDescription')).to.have.property('length', 1);
  });

  it('should change button text based on hasAddon', () => {
    expect(subject.find('.main-install__minor-cta')).to.be.true;
    subject.setProps({ hasAddon: true });
    expect(subject.find('.experiment-summary')).to.be.false;
  });

  it('should display an "enabled" text if the experiment is enabled', () => {
    expect(subject.find('.enabled-tab')).to.have.property('length', 0);
    subject.setProps({ enabled: true });
    expect(subject.find('.enabled-tab')).to.have.property('length', 1);
  });

  it('should display a feedback button if the experiment is enabled', () => {
    expect(subject.find('.featured-feedback')).to.have.property('length', 0);

    subject.setProps({ enabled: true });

    expect(subject.find('.featured-feedback')).to.have.property('length', 1);
  });

  it('should ping GA when feedback is clicked', () => {
    subject.setProps({ enabled: true });
    subject.find('.featured-feedback').simulate('click', mockClickEvent);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: props.eventCategory,
      eventAction: 'Give Feedback',
      eventLabel: mockExperiment.title
    }]);
  });

  it('should display "just launched" banner if created date within 2 weeks, never seen, and not enabled', () => {
    expect(subject.find('.featured-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: false,
      experiment: { ...mockExperiment,
        created: moment().subtract(1, 'week').utc(),
        modified: moment().subtract(1, 'week').utc()
      }
    });

    expect(subject.find('.featured-summary').hasClass('just-launched')).to.be.true;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 1);

    subject.setProps({ enabled: true });

    expect(subject.find('.featured-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: true
    });

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.featured-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);
  });

  it('should display "just updated" banner if modified date within 2 weeks, since last seen, not enabled, and no just launched', () => {
    expect(subject.find('.featured-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);

    props = { ...props,
      enabled: false,
      getExperimentLastSeen:
        sinon.spy(() => moment().subtract(1.5, 'week').valueOf()),
      experiment: { ...mockExperiment,
        modified: moment().subtract(1, 'week').utc()
      }
    };
    subject.setProps(props);

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.featured-summary').hasClass('just-updated')).to.be.true;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 1);

    subject.setProps({ enabled: true });

    expect(subject.find('.featured-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: false,
      getExperimentLastSeen: sinon.spy(() => moment().valueOf())
    });

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.featured-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);
  });

  it('should have a "More Detail" button if the browser is not supported Firefox', () => {
    expect(findLocalizedById(subject, 'moreDetail')).to.have.property('length', 0);
    subject.setProps({
      experiment: { ...mockExperiment },
      isFirefox: false,
      isMinFirefox: false
    });
    expect(findLocalizedById(subject, 'moreDetail')).to.have.property('length', 1);
  });

  it('should have a "Manage" button if the experiment is enabled and has an addon', () => {
    expect(findLocalizedById(subject, 'experimentCardManage')).to.have.property('length', 0);
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    expect(findLocalizedById(subject, 'experimentCardManage')).to.have.property('length', 1);
  });

  it('should ping GA when manage is clicked', () => {
    subject.find('.featured-summary').simulate('click', mockClickEvent);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: props.eventCategory,
      eventAction: 'Open detail page',
      eventLabel: mockExperiment.title
    }]);
  });
});
