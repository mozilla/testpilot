/* global describe, beforeEach, it */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IncompatibleAddons from './IncompatibleAddons';

describe('app/containers/ExperimentPage/IncompatibleAddons', () => {
  let mockExperiment, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing',
      incompatible: {}
    };
    props = {
      experiment: mockExperiment,
      installedAddons: []
    };
    subject = shallow(<IncompatibleAddons {...props} />);
  });

  it('should render a warning only if incompatible add-ons are installed', () => {
    expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

    const experiment = { ...mockExperiment, incompatible: { foo: 1, bar: 2 } };
    subject.setProps({ experiment });

    subject.setProps({ installedAddons: ['baz'] });
    expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

    subject.setProps({ installedAddons: ['baz', 'bar'] });
    expect(subject.find('.incompatible-addons')).to.have.property('length', 1);
  });
});
