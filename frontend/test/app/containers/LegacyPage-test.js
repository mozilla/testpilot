import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import LegacyPage from '../../../src/app/containers/LegacyPage';


describe('app/containers/LegacyPage', () => {
  it('should render legacy modal', () => {
    const props = {
      sendToGA: sinon.spy()
    };
    expect(shallow(<LegacyPage {...props} />).find('#legacy-modal')).to.have.length(1);
  });
});
