import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import HomePageWithAddon from '../../../src/app/components/HomePageWithAddon';

describe('app/components/HomePageWithAddon', () => {
  let props, experiments, subject;
  beforeEach(function() {
    props = {
      experiments: [ { title: 'foo' }, { title: 'bar' } ],
      hasAddon: true,
      uninstallAddon: sinon.spy(),
      navigateTo: sinon.spy(),
      isExperimentEnabled: sinon.spy(),
      getCookie: sinon.spy(),
      removeCookie: sinon.spy(),
      getWindowLocation: sinon.spy(() => ({ search: '' })),
      subscribeToBasket: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy()
    };
    subject = shallow(<HomePageWithAddon {...props} />);
  });

  it('should render expected content', () => {
    expect(subject.state('hideEmailDialog')).to.be.false;
    expect(subject.find('ExperimentCardList')).to.have.property('length', 1);
    expect(subject.find('EmailDialog')).to.have.property('length', 0);
  });

  it('should render a Loading component if no experiments available', () => {
    subject.setProps({ experiments: [] });
    expect(subject.find('LoadingPage')).to.have.property('length', 1);
  });

  it('should show an email dialog if the URL contains utm_campaign=restart-required',  () => {
    const getWindowLocation = sinon.spy(() =>
      ({ search: 'utm_campaign=restart-required' }));
    subject.setProps({ getWindowLocation });
    expect(subject.find('EmailDialog')).to.have.property('length', 1);

    subject.setState({ hideEmailDialog: true });
    expect(subject.find('EmailDialog')).to.have.property('length', 0);
  });

  it('should show an email dialog if the first-run cookie is set', () => {
    const getCookie = sinon.spy(name => 1);
    subject.setProps({ getCookie });
    expect(subject.find('EmailDialog')).to.have.property('length', 1);

    subject.setState({ hideEmailDialog: true });
    expect(subject.find('EmailDialog')).to.have.property('length', 0);
  });
});
