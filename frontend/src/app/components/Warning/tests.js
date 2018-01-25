/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import Warning from "./index";


describe("app/components/Warning", () => {
  it("should omit the <header> when a title isn't passed", () => {
    const subject = shallow(<Warning/>);
    expect(subject.find("header")).to.have.length(0);
  });

  it("should omit the subtitle element when not passed", () => {
    const subject = shallow(<Warning title="hi"/>);
    expect(subject.find("header p")).to.have.length(0);
  });

  it("should pass on its children", () => {
    const subject = shallow(<Warning><abbr foo="bar"/></Warning>);
    expect(subject.find("abbr")).to.have.length(1);
  });

  const props = {
    title: "Hi",
    titleL10nId: "hi-id",
    subtitle: "Bye",
    subtitleL10nId: "bye-id"
  };
  const subject = shallow(<Warning {...props}/>);

  it("should render the title correctly", () => {
    const title = subject.find("h3");
    expect(title).to.have.length(1);
    expect(title.text()).to.equal(props.title);
    expect(title.parent().prop("id")).to.equal(props.titleL10nId);
  });

  it("should render the subtitle correctly", () => {
    const subtitle = subject.find("header p");
    expect(subtitle).to.have.length(1);
    expect(subtitle.text()).to.equal(props.subtitle);
    expect(subtitle.parent().prop("id")).to.equal(props.subtitleL10nId);
  });
});
