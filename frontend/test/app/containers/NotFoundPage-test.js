import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NotFoundPage from '../../../src/app/containers/NotFoundPage';


describe('app/containers/NotFoundPage', () => {
  it('should render notFoundHeader string', () => {
    expect(shallow(<NotFoundPage />)
      // HACK: .find('[data-l10n-id="errorMessage"]') seems not to work
      .findWhere(el => 'notFoundHeader' === el.props()['data-l10n-id']))
      .to.have.length(1);
  });
});
