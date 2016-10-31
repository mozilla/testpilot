import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import HomePageWithAddon from '../../../src/app/containers/HomePageWithAddon';

describe('app/containers/HomePageWithAddon', () => {
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
      openWindow: sinon.spy(),
      isAfterCompletedDate: sinon.spy(x => !!x.completed)
    };
    subject = shallow(<HomePageWithAddon {...props} />);
  });

  it('should render expected content', () => {
    expect(subject.state('showEmailDialog')).to.be.false;
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
    props = { ...props, getWindowLocation }
    subject = shallow(<HomePageWithAddon {...props} />);
    expect(subject.find('EmailDialog')).to.have.property('length', 1);

    subject.setState({ showEmailDialog: false });
    expect(subject.find('EmailDialog')).to.have.property('length', 0);
  });

  it('should show an email dialog if the first-run cookie is set', () => {
    const getCookie = sinon.spy(name => 1);
    props = { ...props, getCookie }
    subject = shallow(<HomePageWithAddon {...props} />);
    expect(subject.find('EmailDialog')).to.have.property('length', 1);
    expect(props.removeCookie.called).to.be.true;

    subject.setState({ showEmailDialog: false });
    expect(subject.find('EmailDialog')).to.have.property('length', 0);
  });

  it('should hide completed experiments behind a button', () => {
    const experiments = [ { title: 'foo' }, { title: 'bar', completed: '2016-10-01' } ];
    subject.setProps({ experiments });
    const current = subject.find('ExperimentCardList');
    expect(current.length).to.equal(1);
    expect(current.prop('experiments').length).to.equal(1);
    expect(current.prop('experiments')[0].title).to.equal('foo');
    subject.setState({ showPastExperiments: true });
    const lists = subject.find('ExperimentCardList');
    expect(lists.length).to.equal(2);
    const past = lists.last();
    expect(past.length).to.equal(1);
    expect(past.prop('experiments').length).to.equal(1);
    expect(past.prop('experiments')[0].title).to.equal('bar');
  });
});
