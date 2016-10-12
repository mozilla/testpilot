import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LoadingPage from '../../../src/app/containers/LoadingPage';


describe('app/containers/LoadingPage', () => {
  const subject = shallow(<LoadingPage />);
  it('should render expected default content', () => {
    expect(subject.find('div.full-page-wrapper')).to.have.property('length', 1);
    expect(subject.find('Loading')).to.have.property('length', 1);
  });
});
