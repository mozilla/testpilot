import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import HomePage from '../../../src/app/containers/HomePage';


describe('app/containers/HomePage', () => {
  it('should show experiment list if the add-on is installed', () => {
    const wrapper = shallow(<HomePage hasAddon={true} />);
    expect(wrapper.find('HomePageNoAddon')).to.have.property('length', 0);
    expect(wrapper.find('HomePageWithAddon')).to.have.property('length', 1);
  });

  it('should prompt to install the add-on if not already installed', () => {
    const wrapper = shallow(<HomePage hasAddon={false} />);
    expect(wrapper.find('HomePageNoAddon')).to.have.property('length', 1);
    expect(wrapper.find('HomePageWithAddon')).to.have.property('length', 0);
  });
});
