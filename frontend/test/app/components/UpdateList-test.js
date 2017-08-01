import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UpdateList, { Update, prettyDate } from '../../../src/app/components/UpdateList';

describe('app/components/UpdateList', () => {
  it('should display nothing if no updates are available', () => {
    const props = {
      experiments: [],
      newsUpdates: []
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
      newsUpdates: [
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
      const icon = subject.find('.experiment-icon');
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

  });

});
