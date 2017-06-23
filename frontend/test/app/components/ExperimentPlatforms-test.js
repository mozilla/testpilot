
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';

import ExperimentPlatforms from '../../../src/app/components/ExperimentPlatforms';


describe('app/components/ExperimentPlatforms', () => {
  let mockExperiment, props, subject;
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
    props = {
      experiment: mockExperiment
    }
    subject = shallow(<ExperimentPlatforms {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('should not display platforms if there are none', () => {
    expect(subject.find('.experiment-platform')).to.have.property('length', 0);
  });

  it('should use expected l10n ID and icons for known platforms', () => {
   subject.setProps({
      experiment: {
        ...mockExperiment,
        platforms: ['addon', 'mobile', 'web', 'diving', 'political']
      }
    });
    expect(findByL10nID('experimentPlatformWebAddonMobile')).to.have.property('length', 1);
    ['addon', 'mobile', 'web'].forEach(platform =>
      expect(subject.find(`.platform-icon-${platform}`)).to.have.property('length', 1));
    ['diving', 'political'].forEach(platform =>
      expect(subject.find(`.platform-icon-${platform}`)).to.have.property('length', 0));
  });


});
