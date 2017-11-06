import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, render } from 'enzyme';

import HomePageWithAddon from '../../../src/app/containers/HomePageWithAddon';

const today = new Date();
const twoWeeksAgo = today - 1000 * 60 * 60 * 24 * 15;
const twoDaysAgo = today - 1000 * 60 * 60 * 24 * 2;
const oneDayAgo = today - 1000 * 60 * 60 * 24 * 1;

describe('app/containers/HomePageWithAddon', () => {
  let props, experiments, subject;
  beforeEach(function() {
    props = {
      experiments: [ { title: 'foo' }, { title: 'bar' } ],
      hasAddon: true,
      uninstallAddon: sinon.spy(),
      navigateTo: sinon.spy(),
      newsletterForm: {succeeded: true},
      majorNewsUpdates: [
        {
          experimentSlug: 'min-vid',
          slug: 'min-vid-update-1',
          title: 'update shouldnt show since its more than 2 weeks old',
          link: 'https://medium.com/firefox-test-pilot',
          major: true,
          created: new Date(twoWeeksAgo).toISOString(),
          published: new Date(twoWeeksAgo).toISOString(),
          image: 'http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg',
          content: 'update shouldnt show since its more than 2 weeks old'},
        {
          experimentSlug: 'min-vid',
          slug: 'min-vid-update-2',
          title: 'update should be 2nd in carousel',
          link: 'https://medium.com/firefox-test-pilot',
          major: true,
          created: new Date(twoDaysAgo).toISOString(),
          published: new Date(twoDaysAgo).toISOString(),
          image: 'http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg',
          content: 'Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well.'},
        {
          experimentSlug: 'min-vid',
          slug: 'min-vid-update-3',
          title: 'Another update, should be shown 1st in the carousel since it is fresher',
          link: 'https://medium.com/firefox-test-pilot',
          major: true,
          created: new Date(oneDayAgo).toISOString(),
          published: new Date(oneDayAgo).toISOString(),
          image: 'http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg',
          content: 'Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well.'
        }
      ],
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

  it('should not show anything if no experiments are available', () => {
    subject.setProps({ experiments: [] });
    expect(subject.find('View')).to.have.property('length', 0);
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

  it('should show news update dialog if valid news updates are available', () => {
    subject = render(<HomePageWithAddon {...props} getExperimentLastSeen={()=>{}}/>);
    expect(subject.find('.news-updates-modal')).to.have.property('length', 1);

    subject = render(<HomePageWithAddon {...props}
      majorNewsUpdates={[]}
      getExperimentLastSeen={()=>{}}/>);
    expect(subject.find('.news-updates-modal')).to.have.property('length', 0);
  });
});
