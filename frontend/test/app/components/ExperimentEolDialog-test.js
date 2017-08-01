import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { findLocalizedById } from '../util';

import ExperimentEolDialog from '../../../src/app/components/ExperimentEolDialog';

describe('app/components/ExperimentEolDialog', () => {
  let props, mockClickEvent, subject;
  beforeEach(function() {
    props = {
      onSubmit: sinon.spy(),
      onCancel: sinon.spy()
    };
    mockClickEvent = {
      preventDefault: sinon.spy()
    };
    subject = shallow(<ExperimentEolDialog {...props} />);
  });

  it('should display expected content', () => {
    expect(subject.find('#retire-dialog-modal')).to.have.property('length', 1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(props.onCancel.called).to.be.true;
  });

  it('calls onSubmit when the disable button is clicked', () => {
    findLocalizedById(subject, 'disableExperiment').find('button')
      .simulate('click', mockClickEvent);
    expect(props.onSubmit.called).to.be.true;
  });

});
