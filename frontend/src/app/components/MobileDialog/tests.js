/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import MobileDialog from "./index.js";

describe("app/components/MobileDialog", () => {
  let props;
  const experiment = {
    title: "Foobar",
    slug: "foobar",
    android_url: "https://example.com/survey"
  };

  let sendToGA, onCancel, preventDefault, subject, mockClickEvent, mockEscapeKeyDownEvent;
  beforeEach(() => {
    sendToGA = sinon.spy();
    onCancel = 
    preventDefault = sinon.spy();
    mockClickEvent = { preventDefault, target: {} };
    mockEscapeKeyDownEvent = {
      preventDefault,
      key: "Escape"
    };
    props = {
      experiment: experiment,
      countryCode: null,
      fetchCountryCode: sinon.spy(),
      onCancel: sinon.spy(),
      sendToGA: sinon.spy()
    }

    subject = shallow(<MobileDialog {...props}/>);
  });

  it("should render expected content", () => {
    expect(subject.find(".modal-container"))
      .to.have.property("length", 1);
    expect(subject.find(".mobile-header-img")).to.be.ok;
  });

  it("should render loading section until we recieve a country code", () => {
    expect(subject.find(".loading-wrapper")).to.be.ok;
    subject.setProps({countryCode: "US"});
    expect(subject.find(".loading-wrapper")).to.have.property("length", 0);
  });

  it("should render sms input if correct country code is provided", () => {
    subject.setProps({countryCode: "US"});
    expect(subject.find(".sms-input")).to.be.ok;

    subject.setProps({countryCode: "INCORRECT"});
    expect(subject.find(".email-input")).to.be.ok;
  });  

  it("should call onCancel on cancel button click", () => {
    subject.find(".modal-cancel").simulate("click", mockClickEvent);
    expect(props.onCancel.called).to.be.true;
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "SMS Modal Interactions",
      eventAction: "dialog dismissed",
      eventLabel: "cancel",
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    }]);
  });

  it("should call onCancel when the <Escape> key is pressed", () => {
    subject.find(".modal-container").simulate("keyDown", mockEscapeKeyDownEvent);
    expect(props.onCancel.called).to.be.true;
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "SMS Modal Interactions",
      eventAction: "dialog dismissed",
      eventLabel: "cancel",
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    }]);
  });
});
