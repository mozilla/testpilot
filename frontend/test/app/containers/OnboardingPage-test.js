import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import OnboardingPage from "../../../src/app/containers/OnboardingPage";


describe("app/containers/OnboardingPage", () => {
  it("should render onboarding page", () => {
    const props = {
      uninstallAddon: sinon.spy(),
      openWindow: sinon.spy(),
      sendToGA: sinon.spy()
    };
    expect(shallow(<OnboardingPage {...props} />).find("#onboarding")).to.have.length(1);
  });
});
