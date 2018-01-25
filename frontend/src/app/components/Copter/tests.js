/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import Copter from "./index";

describe("app/components/Copter", () => {
  let props, subject;
  beforeEach(() => {
    props = {
      animation: "celery-man"
    };

    subject = shallow(<Copter {...props} />);
  });

  it("should render a full Copter by default", () =>
    expect(subject.find(".copter").hasClass("copter--small")).to.be.false);

  it("should render a small Copter if specified", () => {
    subject.setProps({ small: true });
    expect(subject.find(".copter").hasClass("copter--small")).to.be.true;
  });

  it("should accept an animation class if specified", () =>
    expect(subject.find(".copter__inner").hasClass("celery-man")).to.be.true);
});
