import React from "react";
import { expect } from "chai";
import sinon from "sinon";

import { defaultState,
         newsletterFormSetEmail as setEmail,
         newsletterFormSetPrivacy as setPrivacy,
         newsletterFormSetSubmitting as setSubmitting,
         newsletterFormSetFailed as setFailed,
         newsletterFormSetSucceeded as setSucceeded }
         from "../../../src/app/reducers/newsletter-form";


describe("app/reducers/newsletter-form", () => {
  describe("setEmail", () => {
    const NEW_EMAIL = "foo@bar.com";

    it("should update email", () => {
      const reduced = setEmail(defaultState(), { payload: NEW_EMAIL });
      expect(reduced.email).to.equal(NEW_EMAIL);
    });
  });

  describe("setPrivacy", () => {
    const NEW_PRIVACY = true;

    it("should update privacy", () => {
      const reduced = setPrivacy(defaultState(), { payload: NEW_PRIVACY });
      expect(reduced.privacy).to.equal(NEW_PRIVACY);
    });
  });

  describe("setSubmitting", () => {
    const reduced = setSubmitting(defaultState());

    it("should mark as submitting", () => {
      expect(reduced.submitting).to.equal(true);
    });

    it("should mark as not failed", () => {
      expect(reduced.failed).to.equal(false);
    });

    it("should mark as not succeeded", () => {
      expect(reduced.succeeded).to.equal(false);
    });
  });

  describe("setFailed", () => {
    const reduced = setFailed(defaultState());

    it("should mark as not submitting", () => {
      expect(reduced.submitting).to.equal(false);
    });

    it("should mark as failed", () => {
      expect(reduced.failed).to.equal(true);
    });

    it("should mark as not succeeded", () => {
      expect(reduced.succeeded).to.equal(false);
    });
  });

  describe("setSucceeded", () => {
    const reduced = setSucceeded(defaultState());

    it("should mark as not submitting", () => {
      expect(reduced.submitting).to.equal(false);
    });

    it("should mark not failed", () => {
      expect(reduced.failed).to.equal(false);
    });

    it("should mark as succeeded", () => {
      expect(reduced.succeeded).to.equal(true);
    });
  });
});
