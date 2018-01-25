/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import PastExperiments from "./index.js";

describe("app/components/PastExperiments", () => {
  const pastExperiments = [{ title: "foo" }, { title: "bar" }];
  let subject;

  beforeEach(() => {
    subject = shallow(<PastExperiments pastExperiments={ pastExperiments } />);
  });

  it("should hide completed experiments behind a button and show them if state toggled", () => {
    subject.setState({ showPastExperiments: false });
    const hidden = subject.find("ExperimentCardList");
    expect(hidden.length).to.equal(0);
    subject.setState({ showPastExperiments: true });
    const lists = subject.find("ExperimentCardList");
    expect(lists.length).to.equal(1);
    const shown = lists.last();
    expect(shown.prop("experiments").length).to.equal(2);
    expect(shown.prop("experiments")[0].title).to.equal("foo");
  });
});
