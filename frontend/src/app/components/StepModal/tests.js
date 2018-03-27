/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";

import StepModal from "./index";

describe("app/components/StepModal", () => {
  let mockClickEvent, props, subject;
  beforeEach(() => {
    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    };
    props = {
      steps: [{ title: "yup" }, { title: "yup" }, { title: "yup" }],
      wrapperClass: "news-updates-modal",
      onCancel: sinon.spy(),
      onComplete: sinon.spy(),
      stepNextPing: sinon.spy(),
      stepBackPing: sinon.spy(),
      stepToDotPing: sinon.spy(),
      renderStep: sinon.spy(),
      renderHeaderTitle: sinon.spy()
    };
    subject = mount(<StepModal {...props} />);
  });

  // todo(dj): add these back in after next 57 launch
  // it('should call stepNextPing and stepBackPing (which will both ping GA) when back and next buttons are clicked', () => {
  //   subject.find('.step-next').simulate('click', mockClickEvent);

  //   expect(props.stepNextPing.called).to.be.true;

  //   subject.find('.step-back').simulate('click', mockClickEvent);

  //   expect(props.stepBackPing).to.be.true;
  // });

  it("should call renderStep when rendering", () => {
    expect(props.renderStep.called).to.be.true;
  });

  it("should call onCancel when clicking close icon", () => {
    subject.find(".modal-cancel").simulate("click", mockClickEvent);
    expect(props.onCancel.called).to.be.true;
  });

  it("should call renderHeaderTitle when rendering", () => {
    expect(props.renderHeaderTitle.called).to.be.true;
  });

  // todo(dj) add test for wrapperClass (.hasClass
  // method is acting weird rn)

  it("should call onComplete (which will ping GA) when done button is clicked", () => {
    subject.find(".step-done").simulate("click", mockClickEvent);
    expect(props.onComplete.called).to.be.true;
  });
});
