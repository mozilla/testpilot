import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../util';

import HomePage from '../../../src/app/containers/HomePage';


describe('app/containers/HomePage', () => {
  let props, subject, experiments;
  beforeEach(function() {
    props = {
      experiments: [],
      hasAddon: false,
      isFirefox: false,
      replaceState: sinon.spy(),
    };
    subject = shallow(<HomePage {...props} />);
  });

  it('should return HomePageNoAddon if hasAddon is false', () => {
    expect(subject.find('HomePageNoAddon')).to.have.property('length', 1);
    expect(subject.find('HomePageWithAddon')).to.have.property('length', 0);
    expect(props.replaceState.called).to.be.false;
  });

  it('should return HomePageWithAddon if hasAddon is true', () => {
    subject.setProps({ hasAddon: true });
    expect(subject.find('HomePageWithAddon')).to.have.property('length', 1);
    expect(subject.find('HomePageNoAddon')).to.have.property('length', 0);
    expect(props.replaceState.called).to.be.true;
  });
});
