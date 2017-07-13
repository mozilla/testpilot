import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { findLocalizedById } from '../util';

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
      installAddon: sinon.spy(() => Promise.resolve()),
      navigateTo: sinon.spy(),
      varianttests: {
        installButtonBorder: "default"
      }
    };
    subject = mount(<MainInstallButton {...props} />);
  });

  it('does not show an install button on mobile', () => {
    expect(subject.find('.default-btn-msg')).to.have.property('length', 1);
    subject.setProps({ isMobile: true });
    expect(subject.find('.default-btn-msg')).to.have.property('length', 0);
  });

  it('shows a requires desktop message on mobile firefox', () => {
    subject.setProps({ isMobile: true });
    expect(findLocalizedById(subject, 'landingRequiresDesktop').length).to.equal(1);
  });

  it('shows an install button on desktop firefox', () => {
    expect(findLocalizedById(subject, 'landingInstallButton').length).to.equal(1);
  });

  it('shows an install firefox button on other desktop browsers', () => {
    subject.setProps({ isMinFirefox: false, isFirefox: false });
    expect(findLocalizedById(subject, 'landingDownloadFirefoxTitle').length).to.equal(1);
  });

  it('shows an upgrade button for firefox < minVersion', () => {
    subject.setProps({ isMinFirefox: false });
    expect(findLocalizedById(subject, 'landingUpgradeFirefoxTitle').length).to.equal(1);
  });

  it('shows installing text while installing', () => {
    subject.setState({ isInstalling: true });
    expect(findLocalizedById(subject, 'landingInstallingButton').length).to.equal(1);
  });

  it('shows installed text when hasAddon is true', () => {
    subject.setProps({ hasAddon: true });
    expect(findLocalizedById(subject, 'landingInstalledButton').length).to.equal(1);
  });

  it('calls installAddon on button click', () => {
    subject.find('.install').simulate('click', {});
    expect(props.installAddon.calledOnce).to.equal(true);
  });

  it('navigates to the /experiments page on button click when hasAddon is true', () => {
    subject.setProps({ hasAddon: true });
    subject.find('.install').simulate('click', {});
    expect(props.installAddon.called).to.equal(false);
    expect(props.navigateTo.calledWith('/experiments')).to.equal(true);
  });
});
