/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import MobileDialog from "./index.js";

describe("app/components/MobileDialog", () => {
  const experiment = {
    title: "Foobar",
    slug: "foobar",
    android_url: "https://example.com/survey"
  };

  let sendToGA, onCancel, preventDefault, subject, mockClickEvent, mockEscapeKeyDownEvent;
  beforeEach(() => {
    sendToGA = sinon.spy();
    onCancel = sinon.spy();
    preventDefault = sinon.spy();
    mockClickEvent = { preventDefault, target: {} };
    mockEscapeKeyDownEvent = {
      preventDefault,
      key: "Escape"
    };
    subject = shallow(
      <MobileDialog experiment={experiment} onCancel={onCancel} sendToGA={sendToGA}
        fetchCountryCode={() => {
          return Promise.resolve({json: () => {
            return {country_code: "US"};
          }});
        }} />
    );
  });

  it("should render expected content", () => {
    expect(subject.find(".modal-container"))
      .to.have.property("length", 1);
    expect(subject.find(".mobile-header-img")).to.be.ok;
  });

  it("should call onCancel on cancel button click", () => {
    subject.find(".modal-cancel").simulate("click", mockClickEvent);
    expect(onCancel.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "SMS Modal Interactions",
      eventAction: "dialog dismissed",
      eventLabel: "cancel Send link to device dialog",
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    }]);
  });

  it("should call onCancel when the <Escape> key is pressed", () => {
    subject.find(".modal-container").simulate("keyDown", mockEscapeKeyDownEvent);
    expect(onCancel.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "SMS Modal Interactions",
      eventAction: "dialog dismissed",
      eventLabel: "cancel Send link to device dialog",
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    }]);
  });
});
