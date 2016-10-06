import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import DiscussDialog from '../../../src/app/components/DiscussDialog';

describe('app/components/DiscussDialog', () => {
  const mockClickEvent = { preventDefault() {} };
  const onDismiss = sinon.spy();
  const openWindow = sinon.spy();
  const href = "http://example.com/discuss";
  const subject = shallow(<DiscussDialog onDismiss={onDismiss}
                                         openWindow={openWindow}
                                         href={href} />);

  beforeEach(() => {
    onDismiss.reset();
    openWindow.reset();
  });

  it('should render a dialog', () => {
    expect(subject.find('#discuss-modal')).to.have.length(1);
  });

  it('should just dismiss dialog on cancel', () => {
    subject.find('.modal-actions .cancel').simulate('click', mockClickEvent);
    expect(onDismiss.called).to.be.true;
    expect(openWindow.called).to.be.false;
  });

  it('should change window.location on submit', () => {
    subject.find('.modal-actions .submit').simulate('click', mockClickEvent);
    expect(onDismiss.called).to.be.true;
    expect(openWindow.called).to.be.true;
    expect(openWindow.lastCall.args).to.deep.equal([href, 'testpilotdiscuss']);
  });
});
