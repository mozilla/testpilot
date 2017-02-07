import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Loading from '../../../src/app/components/Loading';

describe('app/components/Loading', () => {
  it('should render <div class="loading">', () =>
    expect(shallow(<Loading />).find('.loading')).to.have.length(1));
  it('should render 4 loader-bars', () =>
    expect(shallow(<Loading />).find('.loading-bar')).to.have.length(4));
});
