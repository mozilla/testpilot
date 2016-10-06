import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SharePage from '../../../src/app/components/SharePage';

describe('app/components/SharePage', () => {
  const linknames = ['facebook', 'twitter', 'email', 'copy'];

  let props, subject;
  beforeEach(function() {
    props = {
      hasAddon: false,
      sendToGA: sinon.spy(),
      openWindow: sinon.spy()
    };
    subject = shallow(<SharePage {...props} />);
  });

  it('should render expected content', () => {
    expect(subject.find('.modal-content')).to.have.property('length', 1);
    expect(subject.find('.share-list')).to.have.property('length', 1);
  });

  it('should ping GA when each of the sharing links are clicked', () => {
    linknames.forEach(label => {
      if (label === 'copy') {
        subject.find('.share-url button').simulate('click');
      } else {
        subject.find(`.share-${label} a`).simulate('click');
      }
      expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
        eventCategory: 'ShareView Interactions',
        eventAction: 'button click',
        eventLabel: label
      }]);
    });
  });

});
