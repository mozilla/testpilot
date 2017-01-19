import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CondensedHeader from '../../../src/app/components/CondensedHeader';

describe('app/components/CondensedHeader', () => {
  
  let props, subject;
  beforeEach(() => {
    props = {
      dataL10nId: 'foo',
      children: 'bar'
    };

    subject = shallow(<CondensedHeader {...props} />);
  });

  it('should render <div class="condensed-header">', () =>
    expect(subject.find('.condensed-header')).to.have.length(1));

  it('should have data-l10n-id on h1', () => 
    expect(subject.find('h1').prop('data-l10n-id')).to.equal('foo'));

  it('should pass children into h1', () =>
    expect(subject.find('h1').prop('children')).to.equal('bar'));

});
