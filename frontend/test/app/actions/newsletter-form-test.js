import fetchMock from "fetch-mock";
import React from "react";
import { expect } from "chai";
import sinon from "sinon";

import { basketUrl } from "../../../src/app/lib/utils";

const FAILED = "NEWSLETTER_FORM_SET_FAILED";
const SUBMITTING = "NEWSLETTER_FORM_SET_SUBMITTING";
const SUCCEEDED = "NEWSLETTER_FORM_SET_SUCCEEDED";

const MOCK_EMAIL = "foo@bar.com";
const MOCK_SOURCE = "https://example.com";

const setUp = responseCode => {
  fetchMock.post(basketUrl, responseCode);
  return {
    dispatch: sinon.spy(),
    subscribe: require("../../../src/app/actions/newsletter-form").default.newsletterFormSubscribe
  };
};

const tearDown = () => {
  fetchMock.restore();
};

describe("app/actions/newsletter-form/subscribe", () => {

  describe("requests with", () => {
    const { dispatch, subscribe } = setUp(200);
    subscribe(dispatch, MOCK_EMAIL, MOCK_SOURCE);

    const url = fetchMock.lastCall(basketUrl)[0];
    const request = fetchMock.lastCall(basketUrl)[1];

    it("the correct URL", () => {
      expect(url).to.equal(basketUrl);
    });

    it("a POST", () => {
      expect(request.method).to.equal("POST");
    });

    it("the correct Content-Type header", () => {
      const expected = "application/x-www-form-urlencoded";
      expect(request.headers["Content-Type"]).to.equal(expected);
    });

    it("the correct newsletter in the body", () => {
      expect(request.body).to.contain("newsletters=test-pilot");
    });

    it("the URLencoded email in the body", () => {
      expect(request.body).to.contain(`email=${encodeURIComponent(MOCK_EMAIL)}`);
    });

    it("has the URL encoded source_url in the body", () => {
      expect(request.body).to.contain(`source_url=${encodeURIComponent(MOCK_SOURCE)}`);
    });

    tearDown();
  });

  describe("when receiving 200s", () => {
    const { dispatch, subscribe } = setUp(200);
    subscribe(dispatch, MOCK_EMAIL);

    it("should submit and succeed", () => {
      expect(dispatch.firstCall.args[0].type).to.equal(SUBMITTING);
      expect(dispatch.secondCall.args[0].type).to.equal(SUCCEEDED);
    });

    tearDown();
  });

  describe("when receiving 429s", () => {
    const { dispatch, subscribe } = setUp(429);
    subscribe(dispatch, MOCK_EMAIL);

    it("should submit and fail", () => {
      expect(dispatch.firstCall.args[0].type).to.equal(SUBMITTING);
      expect(dispatch.secondCall.args[0].type).to.equal(FAILED);
    });

    tearDown();
  });

});
