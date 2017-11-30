/* global describe, it */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../../../../test/app/util';

import NewsFeedPage from './index';

const mockRequiredProps = {
  protocol: 'https:',
  isMinFirefox: true,
  sendToGA: sinon.spy(),
  isDevHost: false,
  isProdHost: true
};

describe('app/containers/NewsFeedPage', () => {
  it('should ping GA on component mount', () => {
    shallow(<NewsFeedPage {...mockRequiredProps} />);
    expect(mockRequiredProps.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'Upgrade Warning',
      eventLabel: 'upgrade notice shown'
    }]);
  });

  it('should show a render updates if updates are available', () => {
    const wrapper = shallow(<NewsFeedPage {...mockRequiredProps} isMinFirefox={false} />);
    expect(findLocalizedById(wrapper, 'warningUpgradeFirefoxTitle')).to.have.property('length', 1);
  });
});
