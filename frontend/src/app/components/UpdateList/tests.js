/* global describe, beforeEach, it */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import UpdateList, { Update, prettyDate } from './index';

describe('app/components/UpdateList', () => {
  it('should display nothing if no updates are available', () => {
    const props = {
      experiments: [],
      staleNewsUpdates: [],
      freshNewsUpdates: []
    };
    const subject = shallow(<UpdateList {...props} />);
    expect(subject.find('.update-list-heading')).to.have.property('length', 0);
    expect(subject.find('Update')).to.have.property('length', 0);
  });

  it('should display updates from available experiments', () => {
    const props = {
      experiments: [
        { slug: 'exp0' },
        { slug: 'exp1' }
      ],
      staleNewsUpdates: [],
      freshNewsUpdates: [
        { slug: 'foo', experimentSlug: 'exp1' },
        { slug: 'bar' }
      ]
    };
    const subject = shallow(<UpdateList {...props} />);

    const renderedUpdates = subject.find('Update');
    expect(renderedUpdates).to.have.property('length', 2);

    const resultUpdateSlugs = new Set(renderedUpdates.map(el => el.props().update.slug));
    expect(resultUpdateSlugs.has('foo')).to.be.true;
    expect(resultUpdateSlugs.has('bar')).to.be.true;

    const resultExperimentSlugs = new Set(renderedUpdates.map(el => (el.props().experiment || {}).slug));
    expect(resultExperimentSlugs.has('exp0')).to.be.false;
    expect(resultExperimentSlugs.has('exp1')).to.be.true;
  });

  it('should display a button for more news updates if older items are available',  () => {
    const props = {
      experiments: [
        { slug: 'exp0' },
        { slug: 'exp1' }
      ],
      freshNewsUpdates: [
        { slug: 'foo', experimentSlug: 'exp1' },
        { slug: 'bar' }
      ]
    };

    const subjectWithoutMore = shallow(<UpdateList {...props} />);
    expect(subjectWithoutMore.find('.more-news')).to.have.property('length', 0);

    props.staleNewsUpdates = [{ slug: 'baz' }];

    const subjectWithMore = shallow(<UpdateList {...props} />);
    expect(subjectWithMore.find('.more-news')).to.have.property('length', 1);
  });

  it('should display at most 5 more news updates and hide the button if the button is clicked', () => {
    const props = {
      experiments: [
        { slug: 'exp0' },
        { slug: 'exp1' }
      ],
      freshNewsUpdates: [
        { slug: 'foo', experimentSlug: 'exp1' },
        { slug: 'bar' }
      ],
      staleNewsUpdates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => ({ slug: `stale-${idx}` }))
    };

    const mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    };

    const subject = shallow(<UpdateList {...props} />);

    expect(subject.find('.more-news')).to.have.property('length', 1);
    expect(subject.find('Update')).to.have.property('length', props.freshNewsUpdates.length);

    subject.find('.more-news').simulate('click', mockClickEvent);

    expect(subject.find('.more-news')).to.have.property('length', 0);
    expect(subject.find('Update')).to.have.property('length',
      props.freshNewsUpdates.length + 5);
  });

  describe('Update', () => {
    it('should display expected basic content', () => {
      const subject = shallow(<Update
        update={{ title: 'foo', content: 'bar' }}
        experiment={{ slug: 'foobar' }} />);
      expect(subject.find('h4').text()).to.equal('foo');
      expect(subject.find('p.summary').text()).to.equal('bar');
    });

    it('should display formatted published date when available', () => {
      const subject = shallow(<Update update={{
        published: '2017-03-17T12:00:00Z',
        created: '2017-02-12T12:00:00Z'
      }} />);
      expect(subject.find('p.up-date').text()).to.equal(prettyDate('2017-03-17T12:00:00Z'));
    });

    it('should display formatted created date when published date is not available', () => {
      const subject = shallow(<Update update={{
        created: '2017-02-12T12:00:00Z'
      }} />);
      expect(subject.find('p.up-date').text()).to.equal(prettyDate('2017-02-12T12:00:00Z'));
    });

    it('should display the icon of an experiment associated with an update', () => {
      const subject = shallow(<Update
        update={{ title: 'foo' }}
        experiment={{ slug: 'foobar' }}
      />);
      const icon = subject.find('.update-experiment-icon');
      expect(icon.hasClass('experiment-icon-foobar')).to.be.true;
    });

    it('should not display a subtitle for general updates', () => {
      const subject = shallow(<Update
        update={{ title: 'foo', content: 'bar' }} />);
      expect(subject.find('h4')).to.have.length(0);
    });

    it('should display the update title as the category when no experiment is given', () => {
      const subject = shallow(<Update update={{ title: 'foo' }} />);
      const categoryTitle = subject.find('.update-content h2');
      expect(categoryTitle.text()).to.equal('foo');
      expect(categoryTitle.hasClass('update-title')).to.be.true;
    });

    it('should display the experiment title as category when experiment is given', () => {
      const subject = shallow(<Update update={{ title: 'foo' }} experiment={{ title: 'Yay hooray' }} />);
      const categoryTitle = subject.find('.update-content h2');
      expect(categoryTitle.text()).to.equal('Yay hooray');
      expect(categoryTitle.parent().props()).to.have.property('id', null);
    });

    it('should include a link only if the update has one', () => {
      const subjectWithoutLink = shallow(<Update
        update={{ title: 'foo' }}
        experiment={{ slug: 'foobar' }}
      />);
      expect(subjectWithoutLink.hasClass('has-link')).to.be.false;

      const subjectWithLink = shallow(<Update
        update={{ title: 'foo', link: 'https://example.com/' }}
        experiment={{ slug: 'foobar' }}
      />);
      expect(subjectWithLink.hasClass('has-link')).to.be.true;
    });

    it('should ping GA when the link is clicked', () => {
      const slug = 'slug-foo';
      const sendToGA = sinon.spy();
      const subject = shallow(<Update
        sendToGA={ sendToGA }
        update={{ slug, title: 'foo', link: 'https://example.com/' }}
        experiment={{ slug: 'foobar' }}
      />);

      const mockClickEvent = {
        preventDefault: sinon.spy(),
        stopPropagation: sinon.spy()
      };
      subject.simulate('click', mockClickEvent);

      expect(sendToGA.lastCall.args).to.deep.equal(['event', {
        eventCategory: 'ExperimentsPage Interactions',
        eventAction: 'click',
        eventLabel: `news-item-${slug}`
      }]);
    });
  });
});
