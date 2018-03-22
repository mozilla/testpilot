/* global describe, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import NewsletterFooter from "./index";

describe("app/components/NewsletterFooter", () => {
  const props = {
    getWindowLocation: sinon.spy(() => "https://example.com"),
    sendToGA: sinon.spy()
  };

  const _subject = (form) => { // eslint-disable-line no-underscore-dangle
    const mergedProps = Object.assign(props, {
      getWindowLocation: sinon.spy(() => "https://example.com")
    });
    return shallow(<NewsletterFooter {...mergedProps} />);
  };

  describe("error notification", () => {
    it("should not show when failed=false", () => {
      const subject = _subject();
      expect(subject.find(".error")).to.have.length(0);
    });

    it("should show when failed=true", () => {
      const subject = _subject();
      subject.setState({isError: true});
      expect(subject.find(".error")).to.have.length(1);
    });
  });

  describe("header", () => {
    it("should render when succeeded=false", () => {
      const subject = _subject().find("header");
      expect(subject.hasClass("success-header")).to.equal(false);
    });

    it("should be replaced with a success message when succeeded=true", () => {
      const subject = _subject();
      subject.setState({isSuccess: true});
      const header = subject.find("header");
      expect(header.hasClass("success-header")).to.equal(true);
    });
  });

  it("should not have the `correct` class by default", () => {
    const subject = _subject();
    expect(subject.hasClass("success")).to.equal(false);
  });

  it("should have `correct` class when succeeded=true", () => {
    const subject = _subject();
    subject.setState({isSuccess: true});
    expect(subject.hasClass("success")).to.equal(true);
  });
});
