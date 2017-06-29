import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../util';

import HomePageNoAddon from '../../../src/app/containers/HomePageNoAddon';


describe('app/containers/HomePageNoAddon', () => {
  let props, subject, experiments;
  beforeEach(function() {
    props = {
      experiments: [],
      hasAddon: false,
      isFirefox: false,
      uninstallAddon: sinon.spy(),
      sendToGA: sinon.spy(),
      isAfterCompletedDate: sinon.spy(x => !!x.completed)
    };
    subject = shallow(<HomePageNoAddon {...props} />);
  });

  it('should return nothing if no experiments are available', () => {
    subject.setProps({ experiments: [] });
    expect(subject.find('#landing-page')).to.have.property('length', 0);
  });

  it('should render default content with experiments loaded', () => {
    const experiments = [ { title: 'foo' }, { title: 'bar' } ];
    subject.setProps({ experiments });
    expect(findLocalizedById(subject, 'landingIntroOne')).to.have.property('length', 1);
    expect(subject.find('ExperimentCardList')).to.have.property('length', 1);
  });

  it('should not display completed experiments', () => {
    const experiments = [ { title: 'foo' }, { title: 'bar', completed: '2016-10-01' } ];
    subject.setProps({ experiments });
    const xs = subject.find('ExperimentCardList').prop('experiments');
    expect(xs.length).to.equal(1);
    expect(xs[0].title).to.equal('foo');
  });

});
