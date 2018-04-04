/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import { RetireConfirmationDialog } from "./index";

describe("app/components/RetireConfirmationDialog", () => {
  let props, mockClickEvent, subject,
    mockEscapeKeyDownEvent, mockEnterKeyDownEvent;
  beforeEach(() => {
    props = {
      uninstallAddon: sinon.spy(),
      onDismiss: sinon.spy(),
      history: {
        push: sinon.spy()
      },
      sendToGA: sinon.spy()
    };
    mockClickEvent = {
      preventDefault: sinon.spy()
    };
    mockEscapeKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: "Escape"
    };
    mockEnterKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: "Enter"
    };
    subject = shallow(<RetireConfirmationDialog {...props} />);
  });

  it("should display expected content", () => {
    expect(subject.find("#retire-dialog-modal")).to.have.property("length", 1);
  });

  it("should call onDismiss when the cancel button is clicked", () => {
    subject.find(".modal-cancel").simulate("click", mockClickEvent);
    expect(props.onDismiss.called).to.be.true;
  });

  it("should call onDismiss when the <Escape> key is pressed", () => {
    subject.find(".modal-container").simulate("keyDown", mockEscapeKeyDownEvent);
    expect(props.onDismiss.called).to.be.true;
  });

  it("should uninstall the addon and ping GA when the proceed button is clicked", () => {
    findLocalizedById(subject, "retireSubmitButton").find("button").simulate("click", mockClickEvent);
    expect(props.uninstallAddon.called).to.be.true;
    expect(props.history.push.called).to.be.true;
    expect(props.history.push.lastCall.args[0]).to.equal("/retire");
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "Retire"
    }]);
  });

  it("should uninstall the addon and ping GA when the <Enter> key is pressed", () => {
    subject.find(".modal-container").simulate("keyDown", mockEnterKeyDownEvent);
    expect(props.uninstallAddon.called).to.be.true;
    expect(props.history.push.called).to.be.true;
    expect(props.history.push.lastCall.args[0]).to.equal("/retire");
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "HomePage Interactions",
      eventAction: "button click",
      eventLabel: "Retire"
    }]);
  });
});
