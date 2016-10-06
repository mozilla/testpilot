import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import LandingPage from '../../../src/app/components/LandingPage';

describe('app/components/LandingPage', () => {
  let props, subject, experiments;
  beforeEach(function() {
    props = {
      experiments: [],
      hasAddon: false,
      isFirefox: false,
      sendToGA: sinon.spy(),
    };
    subject = shallow(<LandingPage {...props} />);
  });

  const findByL10nID = (id) => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('should render a Loading component if no experiments available', () => {
    subject.setProps({ experiments: [] });
    expect(subject.find('LoadingPage')).to.have.property('length', 1);
  });

  it('should render default content with experiments loaded', () => {
    const experiments = [ { title: 'foo' }, { title: 'bar' } ];
    subject.setProps({ experiments });
    expect(findByL10nID('landingIntroLead')).to.have.property('length', 1);
    expect(subject.find('ExperimentCardList')).to.have.property('length', 1);
  });

});
