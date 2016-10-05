import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import Header from '../../../src/app/components/Header';

describe('app/components/Header', () => {

  let preventDefault, stopPropagation, mockClickEvent, sendToGA, openWindow, subject;
  beforeEach(() => {
    preventDefault = sinon.spy();
    stopPropagation = sinon.spy();
    mockClickEvent = { preventDefault, stopPropagation };
    sendToGA = sinon.spy();
    openWindow = sinon.spy();
    subject = shallow(<Header sendToGA={sendToGA} openWindow={openWindow} />);
  });

  const expectMenuGA = label => {
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'Menu Interactions',
      eventAction: 'drop-down menu',
      eventLabel: label
    }]);
  };

  describe('with hasAddon default', () => {
    it('should render default expected content', () => {
      expect(subject.find('#main-header')).to.have.property('length', 1);
    });
    it('should not show the settings button', () => {
      expect(subject.find('.settings-button')).to.have.property('length', 0);
    });
  });

  describe('with hasAddon=true', () => {
    beforeEach(() => {
      subject.setProps({ hasAddon: true });
    });

    it('should show the settings button', () => {
      expect(subject.find('.settings-button')).to.have.property('length', 1);
    });

    it('should show the settings menu when the settings button is clicked', () => {
      subject.find('.settings-button').simulate('click', mockClickEvent);
      expect(subject.state('showSettings')).to.be.true;
      expect(subject.find('.settings-contain')).to.have.property('length', 1);
      expectMenuGA('Toggle Menu');
    });

    describe('and showSettings=true', () => {
      beforeEach(() => {
        subject.setState({ showSettings: true });
      });

      const clickItem = name => {
        subject
          .findWhere(el => name === el.props()['data-l10n-id'])
          .simulate('click', mockClickEvent);
      };

      it('should ping GA and show retire dialog on retire item click', () => {
        clickItem('menuRetire');
        expect(preventDefault.called).to.be.true;
        expect(subject.state('showRetireDialog')).to.be.true;
        expect(subject.find('RetireConfirmationDialog')).to.have.property('length', 1);
        expectMenuGA('Retire');
      });

      it('should ping GA and show discuss dialog on discuss item click', () => {
        clickItem('menuDiscuss');
        expect(preventDefault.called).to.be.true;
        expect(subject.state('showDiscussDialog')).to.be.true;
        expect(subject.find('DiscussDialog')).to.have.property('length', 1);
        expectMenuGA('Discuss');
      });

      it('should ping GA and close menu on wiki clicks', () => {
        clickItem('menuWiki');
        expectMenuGA('wiki');
      });

      it('should ping GA and close menu on file issue click', () => {
        clickItem('menuFileIssue');
        expectMenuGA('file issue');
      });

    });
  });

});
