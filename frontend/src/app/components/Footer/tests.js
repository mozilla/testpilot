/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import Footer from "./index";

describe("app/components/Footer", () => {
  const clickEventFactory = label => {
    const getAttribute = sinon.spy(() => label);
    const mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy(),
      target: {
        getAttribute,
        href: "/foo"
      }
    };
    return { mockClickEvent, getAttribute };
  };
  let subject, sendToGA;
  beforeEach(() => {
    sendToGA = sinon.spy();
    subject = shallow(<Footer sendToGA={sendToGA} />);
  });

  it("should render expected default legal links", () => {
    expect(subject.find(".legal-links")).to.have.property("length", 1);
  });

  it("should render expected social links", () => {
    expect(subject.find(".social-links")).to.have.property("length", 2);
  });

  it("should ping GA on social link clicks", () => {
    [
      {sel: ".social-links .link-icon.github", label: "github"},
      {sel: ".social-links .link-icon.youtube", label: "youtube"},
      {sel: ".social-links .link-icon.twitter.fx", label: "twitter"},
      {sel: ".social-links .link-icon.twitter.txp", label: "twitter"}
    ].forEach(o => {
      const { mockClickEvent, getAttribute } = clickEventFactory(o.label);

      subject.find(o.sel)
        .simulate("click", mockClickEvent);

      expect(getAttribute.called).to.be.true;
      expect(sendToGA.lastCall.args).to.deep.equal(["event", {
        eventCategory: "FooterView Interactions",
        eventAction: "social link clicked",
        eventLabel: o.label,
        outboundURL: mockClickEvent.target.href
      }, mockClickEvent]);
    });
  });
});
