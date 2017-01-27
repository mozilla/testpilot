import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';

import ExperimentRowCard from '../../../src/app/components/ExperimentRowCard';

describe('app/components/ExperimentRowCard', () => {
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
      eventCategory: 'test category',
      navigateTo: sinon.spy(),
      sendToGA: sinon.spy(),
      getExperimentLastSeen: sinon.spy(),
      isAfterCompletedDate: sinon.spy()
    };
    subject = shallow(<ExperimentRowCard {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('should render expected content', () => {
    expect(subject.find('.experiment-information header h3').text()).to.equal(mockExperiment.title);
  });

  it('should have the expected l10n ID', () => {
    // Title field not localized; see #1732.
    expect(findByL10nID('testingTitle')).to.have.property('length', 0);
    expect(findByL10nID('testingSubtitleFoo')).to.have.property('length', 1);
    expect(findByL10nID('testingDescription')).to.have.property('length', 1);
  });

  it('should not have l10n IDs if the experiment is dev-only', () => {
    subject.setProps({ experiment: { dev: true, ...props.experiment } });
    expect(findByL10nID('testingSubtitleFoo')).to.have.property('length', 0);
    expect(findByL10nID('testingDescription')).to.have.property('length', 0);
  });

  it('should change style based on hasAddon', () => {
    expect(subject.find('.experiment-summary').hasClass('has-addon')).to.be.false;
    subject.setProps({ hasAddon: true });
    expect(subject.find('.experiment-summary').hasClass('has-addon')).to.be.true;
  });

  it('should display installation count if over 100', () => {
    const expectedCount = '101';
    subject.setProps({ experiment: { ...mockExperiment, installation_count: expectedCount }});
    expect(subject.find('.participant-count')).to.have.property('length', 1);
    expect(subject.find('.participant-count').text()).to.equal(expectedCount);
  });

  it('should display nothing if installation count <= 100', () => {
    subject.setProps({ experiment: { ...mockExperiment, installation_count: '99' }});
    expect(subject.find('.participant-count')).to.have.property('length', 0);
  });

  it('should display an "enabled" banner if the experiment is enabled', () => {
    expect(subject.find('.experiment-summary').hasClass('enabled')).to.be.false;
    expect(subject.find('.enabled-tab')).to.have.property('length', 0);

    subject.setProps({ enabled: true });

    expect(subject.find('.experiment-summary').hasClass('enabled')).to.be.true;
    expect(subject.find('.enabled-tab')).to.have.property('length', 1);
  });

  it('should display "just launched" banner if created date within 2 weeks, never seen, and not enabled', () => {
    expect(subject.find('.experiment-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: false,
      experiment: { ...mockExperiment,
        created: moment().subtract(1, 'week').utc(),
        modified: moment().subtract(1, 'week').utc()
      }
    });

    expect(subject.find('.experiment-summary').hasClass('just-launched')).to.be.true;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 1);

    subject.setProps({ enabled: true });

    expect(subject.find('.experiment-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: false,
      getExperimentLastSeen: sinon.spy(experiment => moment().valueOf())
    });

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.experiment-summary').hasClass('just-launched')).to.be.false;
    expect(subject.find('.just-launched-tab')).to.have.property('length', 0);
  });

  it('should display "just updated" banner if modified date within 2 weeks, since last seen, not enabled, and no just launched', () => {
    expect(subject.find('.experiment-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);

    props = { ...props,
      enabled: false,
      getExperimentLastSeen:
        sinon.spy(experiment => moment().subtract(1.5, 'week').valueOf()),
      experiment: { ...mockExperiment,
        modified: moment().subtract(1, 'week').utc()
      }
    };
    subject.setProps(props);

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.experiment-summary').hasClass('just-updated')).to.be.true;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 1);

    subject.setProps({ enabled: true });

    expect(subject.find('.experiment-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);

    subject.setProps({
      enabled: false,
      getExperimentLastSeen: sinon.spy(experiment => moment().valueOf())
    });

    expect(props.getExperimentLastSeen.called).to.be.true;
    expect(subject.find('.experiment-summary').hasClass('just-updated')).to.be.false;
    expect(subject.find('.just-updated-tab')).to.have.property('length', 0);
  });

  it('should show a "tomorrow" status message when ending in one day', () => {
    expect(findByL10nID('experimentListEndingTomorrow')).to.have.property('length', 0);
    subject.setProps({ experiment: { ...mockExperiment,
      completed: moment().add(23, 'hours').utc()
    }});
    expect(findByL10nID('experimentListEndingTomorrow')).to.have.property('length', 1);
  });

  it('should show a "soon" status message when ending in one week', () => {
    expect(findByL10nID('experimentListEndingSoon')).to.have.property('length', 0);
    subject.setProps({ experiment: { ...mockExperiment,
      completed: moment().add(6, 'days').utc()
    }});
    expect(findByL10nID('experimentListEndingSoon')).to.have.property('length', 1);
  });

  it('should have a "Learn More" button if the experiment is completed', () => {
    expect(findByL10nID('experimentCardLearnMore')).to.have.property('length', 0);
    subject.setProps({
      experiment: { ...mockExperiment,
        completed: moment().subtract(1, 'days').utc()
      },
      isAfterCompletedDate: () => true
    });
    expect(findByL10nID('experimentCardLearnMore')).to.have.property('length', 1);
    expect(findByL10nID('participantCount')).to.have.property('length', 0);
  });

  it('should have a "Manage" button if the experiment is enabled and has an addon', () => {
    expect(findByL10nID('experimentCardManage')).to.have.property('length', 0);
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    expect(findByL10nID('experimentCardManage')).to.have.property('length', 1);
  })

  it('should ping GA and open the detail page when clicked', () => {
    subject.find('.experiment-summary').simulate('click', mockClickEvent);

    expect(mockClickEvent.preventDefault.called).to.be.true;
    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: props.eventCategory,
      eventAction: 'Open detail page',
      eventLabel: mockExperiment.title
    }]);
    expect(props.navigateTo.lastCall.args[0])
      .to.equal(`/experiments/${mockExperiment.slug}`);
  });

  it('should have a Link component with the right properties', () => {
    const link = subject.find('Link');
    expect(link).to.not.be.a('null');
    expect(link.props()).to.contain.all({
      to: `/experiments/${mockExperiment.slug}`,
      className: 'experiment-summary'
    });
  });
});
