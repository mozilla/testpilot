/* global describe, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import NewsletterFooter from "./index";

describe("app/components/NewsletterFooter", () => {
  const props = {
    getWindowLocation: sinon.spy(() => "https://example.com"),
    sendToGA: sinon.spy(),
    newsletterForm: {
      subscribe: sinon.spy(),
      setEmail: sinon.spy(),
      setPrivacy: sinon.spy()
    }
  };

  const _subject = (form) => { // eslint-disable-line no-underscore-dangle
    const mergedProps = Object.assign(props, {
      getWindowLocation: sinon.spy(() => "https://example.com"),
      newsletterForm: {
        subscribe: sinon.spy(),
        setEmail: sinon.spy(),
        setPrivacy: sinon.spy(),
        ...form
      }
    });
    return shallow(<NewsletterFooter {...mergedProps} />);
  };

  describe("error notification", () => {
    it("should not show when failed=false", () => {
      const subject = _subject({ failed: false });
      expect(subject.find(".error")).to.have.length(0);
    });

    it("should show when failed=true", () => {
      const subject = _subject({ failed: true });
      expect(subject.find(".error")).to.have.length(1);
    });
  });

  describe("header", () => {
    it("should render when succeeded=false", () => {
      const subject = _subject({ succeeded: false }).find("header");
      expect(subject.hasClass("success-header")).to.equal(false);
    });

    it("should be replaced with a success message when succeeded=true", () => {
      const subject = _subject({ succeeded: true }).find("header");
      expect(subject.hasClass("success-header")).to.equal(true);
    });
  });

  it("should not have the `correct` class by default", () => {
    const subject = _subject({ succeeded: false });
    expect(subject.hasClass("success")).to.equal(false);
  });

  it("should have `correct` class when succeeded=true", () => {
    const subject = _subject({ succeeded: true });
    expect(subject.hasClass("success")).to.equal(true);
  });

  it("should have called sendToGA with a success event when succeeded=true", () => {
    _subject({ succeeded: true, failed: false });
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "HomePage Interactions",
      eventAction: "footer newsletter form success",
      eventLabel: "email submitted to basket"
    }]);
  });

  it("should have called sendToGA with a failure event when succeeded=false", () => {
    _subject({ failed: true, succeeded: false });
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "HomePage Interactions",
      eventAction: "footer newsletter form submit",
      eventLabel: "email failed to submit to basket"
    }]);
  });

  it("should pass props to the child NewsletterForm", () => {
    const subject = _subject({ foo: "bar" });
    expect(subject.find("NewsletterForm").prop("foo")).to.equal("bar");
  });
});
