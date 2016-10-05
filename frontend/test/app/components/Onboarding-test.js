import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import OnboardingPage from '../../../src/app/components/OnboardingPage';

describe('app/components/OnboardingPage', () => {
  it('should render onboarding page', () => {
    const props = {
      navigateTo: sinon.spy(),
      openWindow: sinon.spy(),
      sendToGA: sinon.spy()
    };
    expect(shallow(<OnboardingPage {...props} />).find('#onboarding')).to.have.length(1);
  });
});
