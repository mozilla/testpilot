/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import LayoutWrapper from "./index";

describe("app/components/LayoutWrapper", () => {
  let props, subject;
  beforeEach(() => {
    props = {
      flexModifier: "bar",
      helperClass: "baz"
    };

    subject = shallow(<LayoutWrapper {...props} />);
  });

  it("should include a flex-modifier class of layout-wrapper--bar", () =>
    expect(subject.find(".layout-wrapper").hasClass("layout-wrapper--bar")).to.be.true);
  it("should include a class of baz", () =>
    expect(subject.find(".layout-wrapper").hasClass("baz")).to.be.true);
});
