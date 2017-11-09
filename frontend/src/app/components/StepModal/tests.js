/* global describe, beforeEach, it */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { findLocalizedById } from '../../../../test/app/util';

import StepModal from './index';

const today = new Date();
const twoDaysAgo = today - (1000 * 60 * 60 * 24 * 2);
const oneDayAgo = today - (1000 * 60 * 60 * 24 * 1);
const newsUpdates = [{
  experimentSlug: 'min-vid',
  slug: 'min-vid-update-2',
  title: 'update should be 2nd in carousel',
  link: 'https://medium.com/firefox-test-pilot',
  created: new Date(twoDaysAgo).toISOString(),
  published: new Date(twoDaysAgo).toISOString(),
  image: 'http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg',
  content: 'Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well.'
}, {
  experimentSlug: 'min-vid',
  slug: 'min-vid-update-3',
  title: 'Another update, should be shown 1st in the carousel since it is fresher',
  link: 'https://medium.com/firefox-test-pilot',
  created: new Date(oneDayAgo).toISOString(),
  published: new Date(oneDayAgo).toISOString(),
  image: 'http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg',
  content: 'Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well.'
}];

describe('app/components/StepModal', () => {
  let mockClickEvent, props, subject;
  beforeEach(() => {
    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    };
    props = {
      wrapperClass: 'news-updates-modal',
      onCancel: sinon.spy(),
      onComplete: sinon.spy(),
      stepNextPing: sinon.spy(),
      stepBackPing: sinon.spy(),
      stepToDotPing: sinon.spy(),
      renderStep: sinon.spy(),
      headerTitle: '<div>header title</div>'
    };
    subject = mount(<StepModal {...props} />);
  });

  it('should have the expected l10n ID', () => {
    expect(findLocalizedById(subject, 'stepDoneButton')).to.have.property('length', 1);
  });

  it('should call stepNextPing and stepBackPing (which will both ping GA) when back and next buttons are clicked', () => {
    subject.find('.step-next').simulate('click', mockClickEvent);

    expect(props.stepNextPing.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'forward to step 1'
    }]);

    subject.find('.step-back').simulate('click', mockClickEvent);

    expect(props.stepBackPing.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'back to step 0'
    }]);
  });

  it('should call onComplete (which will ping GA) when done button is clicked', () => {
    subject.setProps({ newsUpdates: [Object.assign(newsUpdates[0])] });

    subject.find('.step-done').simulate('click', mockClickEvent);

    expect(props.onComplete.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'complete updates'
    }]);
  });
});

