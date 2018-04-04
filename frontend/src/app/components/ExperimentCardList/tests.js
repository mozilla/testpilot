/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";

import ExperimentCardList from "./index";
import ExperimentRowCard from "../../components/ExperimentRowCard";


describe("app/components/ExperimentCardList", () => {
  let props, subject;
  beforeEach(() => {
    props = {
      experiments: [
        { slug: "foo" },
        { slug: "bat" }
      ],
      isExperimentEnabled: sinon.spy(() => false),
      // required by ExperimentRowCard {...this.props}
      hasAddon: true,
      eventCategory: "test category",
      sendToGA: sinon.spy()
    };
    subject = shallow(<ExperimentCardList {...props} />);
  });

  it("returns nothing if there are no experiments", () => {
    subject.setProps({ experiments: [] });
    expect(subject.find("LayoutWrapper")).to.have.property("length", 0);
  });

  it("renders ExperimentRowCards for each experiment", () => {
    expect(subject.find(ExperimentRowCard)).to.have.length(props.experiments.length);
  });

  it("respects an exception if specified", () => {
    subject.setProps({ except: props.experiments[0].slug });
    expect(subject.find(ExperimentRowCard)).to.have.length(props.experiments.length - 1);
  });
});
