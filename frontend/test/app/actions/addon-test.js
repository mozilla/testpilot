

import { expect } from 'chai';
import sinon from 'sinon';

const INSTALLED = {installed: "experiments"};

describe('app/actions/addon/setInstalled', () => {
  const setInstalled = require('../../../src/app/actions/addon').default.setInstalled

  it('should return an action with the correct payload', () => {
    expect(JSON.stringify(setInstalled(INSTALLED).payload)).to.equal(JSON.stringify({
      installed: INSTALLED,
      installedLoaded: true
    }));
  });
});
