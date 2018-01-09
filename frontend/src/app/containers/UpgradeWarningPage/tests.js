/* global describe, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import UpgradeWarning from "./index";

const mockRequiredProps = {
  protocol: "https:",
  isMinFirefox: true,
  sendToGA: sinon.spy(),
  isDevHost: false,
  isProdHost: true
};

describe("app/containers/UpgradeWarningPage", () => {
  it("should ping GA on component mount", () => {
    shallow(<UpgradeWarning {...mockRequiredProps} />);
    expect(mockRequiredProps.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "HomePage Interactions",
      eventAction: "Upgrade Warning",
      eventLabel: "upgrade notice shown"
    }]);
  });

  it("should show a warning if Firefox is too old", () => {
    const wrapper = shallow(<UpgradeWarning {...mockRequiredProps} isMinFirefox={false} />);
    expect(findLocalizedById(wrapper, "warningUpgradeFirefoxTitle")).to.have.property("length", 1);
  });

  it("should show a warning if protocol is not https", () => {
    let wrapper = shallow(<UpgradeWarning {...mockRequiredProps} protocol={"http:"} />);
    expect(findLocalizedById(wrapper, "warningHttpsRequiredTitle")).to.have.property("length", 1);

    wrapper = shallow(<UpgradeWarning {...mockRequiredProps} />);
    expect(findLocalizedById(wrapper, "warningHttpsRequiredTitle")).to.have.property("length", 0);
  });

  it("should show a warning if developing app", () => {
    const wrapper = shallow(<UpgradeWarning {...mockRequiredProps} isDevHost={true} />);
    expect(wrapper.find("#warning")).to.have.length(1);
  });

  it("should show a warning if hostname is unapproved", () => {
    const wrapper = shallow(<UpgradeWarning {...mockRequiredProps} isProdHost={false} />);
    expect(wrapper.find("#warning")).to.have.length(1);
  });
});
