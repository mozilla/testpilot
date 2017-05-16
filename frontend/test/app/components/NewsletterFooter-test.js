import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import NewsletterFooter from '../../../src/app/components/NewsletterFooter';


describe('app/components/NewsletterFooter', () => {

  const _subject = (form) => {
    const props = {
      getWindowLocation: sinon.spy(() => 'https://example.com'),
      newsletterForm: {
        subscribe: sinon.spy(),
        setEmail: sinon.spy(),
        setPrivacy: sinon.spy(),
        ...form
      }
    };
    return shallow(<NewsletterFooter {...props} />);
  };

  describe('error notification', () => {
    it('should not show when failed=false', () => {
      const subject = _subject({ failed: false });
      expect(subject.find('.error')).to.have.length(0);
    });

    it('should show when failed=true', () => {
      const subject = _subject({ failed: true });
      expect(subject.find('.error')).to.have.length(1);
    });
  });

  describe('header', () => {
    it('should render when succeeded=false', () => {
      const subject = _subject({ succeeded: false }).find('header');
      expect(subject.hasClass('success-header')).to.equal(false);
    });

    it('should be replaced with a success message when succeeded=true', () => {
      const subject = _subject({ succeeded: true }).find('header');
      expect(subject.hasClass('success-header')).to.equal(true);
    });
  });

  it('should not have the `correct` class by default', () => {
    const subject = _subject({ succeeded: false });
    expect(subject.hasClass('success')).to.equal(false);
  });

  it('should have `correct` class when succeeded=true', () => {
    const subject = _subject({ succeeded: true });
    expect(subject.hasClass('success')).to.equal(true);
  });

  it('should pass props to the child NewsletterForm', () => {
    const subject = _subject({ foo: 'bar' });
    expect(subject.find('NewsletterForm').prop('foo')).to.equal('bar');
  });
});
