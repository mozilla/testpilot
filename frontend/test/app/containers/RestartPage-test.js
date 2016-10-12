import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Restart from '../../../src/app/containers/RestartPage';


describe('app/containers/RestartPage', () => {
  let props, subject;
  beforeEach(function() {
    props = {
      experimentTitle: null,
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

  it('should display expected content without experiment title', () => {
    expect(findByL10nID('restartRequiredSubHeader')).to.have.property('length', 1);
    expect(findByL10nID('restartRequiredFromLanding')).to.have.property('length', 1);
    expect(findByL10nID('restartRequiredFromExperiment')).to.have.property('length', 0);
  });

  it('should display expected content with experiment title', () => {
    const experimentTitle = 'foo bar baz';
    subject.setProps({ experimentTitle });

    expect(findByL10nID('restartRequiredSubHeader')).to.have.property('length', 1);
    expect(findByL10nID('restartRequiredFromLanding')).to.have.property('length', 0);
    expect(findByL10nID('restartRequiredFromExperiment')).to.have.property('length', 1);
  });

});
