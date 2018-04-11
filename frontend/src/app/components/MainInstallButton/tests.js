/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import MainInstallButton from "./index";

describe("app/components/MainInstallButton", () => {
  let subject, props;
  beforeEach(() => {
    props = {
      restartRequired: false,
      sendToGA: sinon.spy(),
      eventCategory: "test",
      hasAddon: false,
      isFirefox: true,
      isMinFirefox: true,
      isMobile: false,
      installAddon: sinon.spy(() => Promise.resolve()),
      isExperimentEnabled: sinon.spy(),
      enableExperiment: sinon.spy(() => Promise.resolve()),
      varianttests: {
        installButtonBorder: "default"
      }
    };
    subject = mount(<MainInstallButton {...props} />);
  });

  it("does not show an install button on mobile", () => {
    expect(subject.find(".default-btn-msg")).to.have.property("length", 1);
    subject.setProps({ isMobile: true });
    expect(subject.find(".default-btn-msg")).to.have.property("length", 0);
  });

  it("shows a requires desktop message on mobile firefox", () => {
    subject.setProps({ isMobile: true });
    expect(findLocalizedById(subject, "landingRequiresDesktop").length).to.equal(1);
  });

  it("shows an install button on desktop firefox", () => {
    expect(findLocalizedById(subject, "landingInstallButton").length).to.equal(1);
  });

  it("shows an install firefox button on other desktop browsers", () => {
    subject.setProps({ isMinFirefox: false, isFirefox: false });
    expect(findLocalizedById(subject, "landingDownloadFirefoxTitle").length).to.equal(1);
  });

  it("shows an upgrade button for firefox < minVersion", () => {
    subject.setProps({ isMinFirefox: false });
    expect(findLocalizedById(subject, "landingUpgradeFirefoxTitle").length).to.equal(1);
  });

  it("shows installing text while installing", () => {
    subject.setState({ isInstalling: true });
    expect(findLocalizedById(subject, "landingInstallingButton").length).to.equal(1);
  });

  it("calls installAddon on button click", () => {
    subject.find(".main-install__button").simulate("click", { button: 0 });
    expect(props.installAddon.calledOnce).to.equal(true);
  });

  it("does not call installAddon on middle button click", () => {
    subject.find(".main-install__button").simulate("click", { button: 1 });
    expect(props.installAddon.called).to.equal(false);
  });

  it("fires sendToGA when install is called", () => {
    const mockExperiment = {slug: "testing", title: "Testing Experiment"};
    subject.setProps({
      isFeatured: true,
      experiment: mockExperiment,
      experimentTitle: mockExperiment.title
    });
    subject.find(".main-install__button").simulate("click", { button: 0 });
    expect(props.sendToGA.lastCall.args.slice(0, 2)).to.deep.equal(["event", {
      eventCategory: props.eventCategory,
      eventAction: "button click",
      eventLabel: "MainInstall Featured Button",
      dimension1: false,
      dimension2: false,
      dimension3: 0,
      dimension4: false,
      dimension5: mockExperiment.title,
      dimension11: mockExperiment.slug,
      dimension13: "Featured Experiment"
    }]);
  });
});
