/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import Banner from "./index";

describe("app/components/Banner", () => {
  let subject, props;
  beforeEach(() => {
    props = {
      children: "foo"
    };
    subject = shallow(<Banner {...props}/>);
  });

  it("should render a full banner by default", () =>
    expect(subject.find(".banner").hasClass("banner--expanded")).to.be.true);

  it("should render a condensed banner if specified", () => {
    subject.setProps({ condensed: true });
    expect(subject.find(".banner").hasClass("banner--condensed")).to.be.true;
  });

  it("should render a background if specified", () => {
    subject.setProps({ background: true });
    expect(subject.find(".banner").hasClass("banner--background")).to.be.true;
  });
});
