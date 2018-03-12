import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "chai";
import sinon from "sinon";
import { shallow, mount } from "enzyme";
import { findLocalizedById } from "../util";

import Restart from "../../../src/app/containers/RestartPage";


describe("app/containers/RestartPage", () => {
  let props, subject;
  beforeEach(function() {
    props = {
      hasAddon: false,
      uninstallAddon: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy()
    };
    subject = mount(
      <MemoryRouter>
        <Restart {...props} />
      </MemoryRouter>
    );
  });

  it("should ping GA on component mount", () => {
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "PostInstall Interactions",
      eventAction: "view modal",
      eventLabel: "restart required"
    }]);
  });
  it("should display restart instructions", () => {
    expect(findLocalizedById(subject, "restartIntroLead")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "restartIntroOne")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "restartIntroTwo")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "restartIntroThree")).to.have.property("length", 1);
  });
});
