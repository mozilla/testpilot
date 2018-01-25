import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow, mount } from "enzyme";
import { findLocalizedById, findLocalizedHtmlById } from "../util";

import RetirePage from "../../../src/app/containers/RetirePage";


describe("app/containers/RetirePage", () => {
  let props, subject;
  beforeEach(function() {
    props = {
      hasAddon: true,
      sendToGA: sinon.spy()
    };
    subject = shallow(<RetirePage {...props} />);
  });

  it("should render expected content", () => {
    expect(findLocalizedById(subject, "retirePageProgressMessage")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "retirePageMessage")).to.have.property("length", 0);
  });

  describe("with hasAddon=false", () => {
    beforeEach(() => {
      subject.setProps({ hasAddon: false });
    });

    it("should render expected content", () => {
      expect(findLocalizedById(subject, "retirePageProgressMessage")).to.have.property("length", 1);
      expect(findLocalizedById(subject, "retirePageMessage")).to.have.property("length", 0);
    });
  });

  describe("with fakeUninstalled=true", () => {
    beforeEach(() => {
      subject.setState({ fakeUninstalled: true });
    });

    it("should render expected content", () => {
      expect(findLocalizedById(subject, "retirePageProgressMessage")).to.have.property("length", 0);
      expect(findLocalizedHtmlById(subject, "retirePageMessage")).to.have.property("length", 1);
    });

    it("should ping GA when survey button is clicked", () => {
      findLocalizedById(subject, "retirePageSurveyButton").find("a").simulate("click");
      expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
        eventCategory: "RetirePage Interactions",
        eventAction: "button click",
        eventLabel: "take survey"
      }]);
    });

  });

});
