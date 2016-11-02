import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import MainInstallButton from '../../../src/app/components/MainInstallButton';

describe('app/components/MainInstallButton', () => {
  let subject, props;
  beforeEach(() => {
    props = {
      restartRequired: false,
      sendToGA: sinon.spy(),
      eventCategory: 'test',
      hasAddon: false,
      isFirefox: true,
      isMinFirefox: true,
      isMobile: false,
      installAddon: sinon.spy()
    };
    subject = shallow(<MainInstallButton {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  it('does not show an install button on mobile', () => {
    expect(subject.find('.default-btn-msg')).to.have.property('length', 1);
    subject.setProps({ isMobile: true });
    expect(subject.find('.default-btn-msg')).to.have.property('length', 0);
  });

  it('shows a requires desktop message on mobile firefox', () => {
    subject.setProps({ isMobile: true });
    expect(findByL10nID('landingRequiresDesktop').length).to.equal(1);
  });

  it('shows an install button on desktop firefox', () => {
    expect(findByL10nID('landingInstallButton').length).to.equal(1);
  });

  it('shows an install firefox button on other desktop browsers', () => {
    subject.setProps({ isMinFirefox: false, isFirefox: false });
    expect(findByL10nID('landingDownloadFirefoxTitle').length).to.equal(1);
  });

  it('shows an upgrade button for firefox < minVersion', () => {
    subject.setProps({ isMinFirefox: false });
    expect(findByL10nID('landingUpgradeFirefoxTitle').length).to.equal(1);
  });

  it('shows installing text while installing', () => {
    subject.setState({ isInstalling: true });
    expect(findByL10nID('landingInstallingButton').length).to.equal(1);
  });

  it('shows installed text when hasAddon is true', () => {
    subject.setProps({ hasAddon: true });
    expect(findByL10nID('landingInstalledButton').length).to.equal(1);
  });

  it('calls installAddon on button click', () => {
    subject.find('.install').simulate('click', {});
    expect(props.installAddon.calledOnce).to.equal(true);
  });

  it('does nothing on button click when hasAddon is true', () => {
    subject.setProps({ hasAddon: true });
    subject.find('.install').simulate('click', {});
    expect(props.installAddon.called).to.equal(false);
  });
});
