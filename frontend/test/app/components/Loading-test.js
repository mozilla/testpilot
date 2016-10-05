import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Loading from '../../../src/app/components/Loading';

describe('app/compomnents/Loading', () => {
  it('should render <div class="loader">', () =>
    expect(shallow(<Loading />).find('.loader')).to.have.length(1));
  it('should render 4 loader-bars', () =>
    expect(shallow(<Loading />).find('.loader-bar')).to.have.length(4));
});
