/* global describe, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";

import NewsletterForm from "./index";
import { defaultState } from "../../reducers/newsletter-form";

describe("app/components/NewsletterForm", () => {
  const makeSubject = (args = {}) => {
    const props = Object.assign(defaultState(), {
      subscribe: sinon.spy(),
      setEmail: sinon.spy(),
      setPrivacy: sinon.spy(),
      ...args
    });
    return mount(<NewsletterForm {...props} />);
  };

  describe("email field", () => {
    const FOO = "foo";
    const setEmail = sinon.spy();

    const subject = makeSubject({
      email: FOO,
      setEmail
    }).find('input[type="email"]');

    it("should be rendered by default", () => {
      expect(subject).to.have.length(1);
    });

    it("should take its value from the store", () => {
      expect(subject.prop("value")).to.equal(FOO);
    });

    it("should fire setEmail on change", () => {
      const newValue = `${FOO}2`;
      subject.simulate("change", { target: { value: newValue } });
      expect(setEmail.calledOnce).to.equal(true);
      expect(setEmail.getCall(0).args[0]).to.equal(newValue);
    });
  });

  describe("privacy field", () => {
    it("should be hidden by default", () => {
      const subject = makeSubject().find("label");
      expect(subject.hasClass("reveal")).to.equal(false);
      expect(subject.hasClass("revealed-field")).to.equal(true);
    });

    it("should be shown when an email is entered", () => {
      const subject = makeSubject({ email: "a" }).find("label");
      expect(subject.hasClass("reveal")).to.equal(true);
    });

    it("should be unchecked by default", () => {
      const subject = makeSubject().find('input[name="privacy"]');
      expect(subject.prop("checked")).to.be.undefined;
    });
  });

  describe("submit button", () => {
    it("should be rendered and enabled by default", () => {
      const subject = makeSubject().find("button");
      expect(subject).to.have.length(1);
      expect(subject.prop("disabled")).to.be.undefined;
    });

    it("should be disabled if submitting", () => {
      const subject = makeSubject({ submitting: true }).find("button");
      expect(subject.prop("disabled")).to.equal(true);
    });

    it("should fire subscribe on submit", () => {
      const subscribe = sinon.spy();
      const subject = makeSubject({ subscribe, privacy: true }).find("form");
      subject.simulate("submit");
      expect(subscribe.calledOnce).to.equal(true);
    });
  });
});
