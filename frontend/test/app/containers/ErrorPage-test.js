import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../util';

import ErrorPage from '../../../src/app/containers/ErrorPage';


describe('app/containers/ErrorPage', () => {
  const noop = () => {};
  it('should render errorMessage string', () => {
    const props = {
      sendToGA: noop,
      uninstallAddon: noop,
      openWindow: noop
    };
    const subject = shallow(<ErrorPage {...props} />);
    expect(findLocalizedById(subject, 'errorMessage2'))
      .to.have.length(1);
  });
});
