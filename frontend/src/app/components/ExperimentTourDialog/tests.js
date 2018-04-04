/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";

import { findLocalizedById } from "../../../../test/app/util";

import ExperimentTourDialog from "./index";

describe("app/components/ExperimentTourDialog", () => {
  let props, mockClickEvent, subject, mockEscapeKeyDownEvent;
  beforeEach(() => {
    mockClickEvent = { preventDefault: sinon.spy() };
    mockEscapeKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: "Escape"
    };

    props = {
      isFirefox: true,
      experiment: {
        title: "Test Experiment",
        slug: "test",
        tour_steps: [
          { image: "/example1.png", copy: "Example 1", copy_l10nsuffix: "foo" },
          { image: "/example2.png", copy: "Example 2" },
          { image: "/example3.png", copy: "Example 3" }
        ]
      },
      isExperimentEnabled: () => true,
      sendToGA: sinon.spy(),
      onComplete: sinon.spy(),
      onCancel: sinon.spy()
    };

    subject = mount(<ExperimentTourDialog {...props} />);
  });

  it("should render expected default content", () => {
    expect(subject.find(".modal-header").text()).to.equal(props.experiment.title);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find(".step-image > img").prop("src"))
      .to.equal(expectedTourStep.image);
    // There is now a LocalizedHtml element between the
    // .step-text element and the p element, so
    // '.step-text > p' won't work, but '.step-text p' does
    expect(subject.find(".step-text p").html())
      .to.include(expectedTourStep.copy);
  });

  it("should render only the experiment name in title if not Firefox", () => {
    subject.setProps({
      isFirefox: false
    });
    expect(subject.find(".modal-header").text()).to.equal(props.experiment.title);
  });

  it("should render only the experiment title if not enabled", () => {
    subject.setProps({
      isExperimentEnabled: () => false,
      experiment: { ...props.experiment }
    });
    expect(subject.find(".modal-header").text()).to.equal(props.experiment.title);
  });

  it("should have the correct l10n IDs", () => {
    expect(findLocalizedById(subject, "testToursteps0CopyFoo").length).to.equal(1);
  });

  it("should not have l10n IDs if the experiment is dev-only", () => {
    subject.setProps({ experiment: { dev: true, ...props.experiment } });
    expect(subject.find(".step-text > Localized").prop("id")).to.equal(null);
  });

  it("should advance one step and ping GA when the next button is clicked", () => {
    subject.find(".step-next").simulate("click", mockClickEvent);

    const expectedTourStep = props.experiment.tour_steps[1];
    expect(subject.find(".step-image > img").prop("src"))
      .to.equal(expectedTourStep.image);
    expect(subject.find(".step-text").html())
      .to.include(expectedTourStep.copy);

    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "forward to step 1",
      dimension11: props.experiment.slug,
      dimension13: "Experiment Detail"
    }]);
  });

  it("should ping GA and call onCancel when cancel button clicked", () => {
    subject.find(".modal-cancel").simulate("click", mockClickEvent);

    expect(props.onCancel.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "cancel tour",
      dimension11: props.experiment.slug
    }]);
  });

  it("should ping GA and call onCancel when the <Escape> key is pressed", () => {
    subject.find(".modal-container").simulate("keyDown", mockEscapeKeyDownEvent);

    expect(props.onCancel.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "cancel tour",
      dimension11: props.experiment.slug
    }]);
  });
});
