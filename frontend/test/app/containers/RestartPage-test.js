import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Restart from '../../../src/app/containers/RestartPage';


describe('app/containers/RestartPage', () => {
  let props, subject;
  beforeEach(function() {
    props = {
      hasAddon: false,
      uninstallAddon: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy()
    };
    subject = shallow(<Restart {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('should ping GA on componment mount', () => {
    const mountedProps = { ...props };
    const mountedSubject = mount(<Restart {...mountedProps} />);
    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'PostInstall Interactions',
      eventAction: 'view modal',
      eventLabel: 'restart required'
    }]);
  });

  it('should display restart instructions', () => {
    expect(findByL10nID('restartIntroLead')).to.have.property('length', 1);
    expect(findByL10nID('restartIntroOne')).to.have.property('length', 1);
    expect(findByL10nID('restartIntroTwo')).to.have.property('length', 1);
    expect(findByL10nID('restartIntroThree')).to.have.property('length', 1);
  });
});
