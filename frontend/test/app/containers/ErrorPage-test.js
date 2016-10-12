import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ErrorPage from '../../../src/app/containers/ErrorPage';


describe('app/containers/ErrorPage', () => {
  const noop = () => {};
  it('should render errorMessage string', () => {
    const props = {
      sendToGA: noop,
      uninstallAddon: noop,
      openWindow: noop
    };
    expect(shallow(<ErrorPage {...props} />)
      // HACK: .find('[data-l10n-id="errorMessage"]') seems not to work
      .findWhere(el => 'errorMessage' === el.props()['data-l10n-id']))
      .to.have.length(1);
  });
});
