/* global describe, beforeEach, it */

import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import moment from "moment";

import { findLocalizedById } from "../../../../test/app/util";
import ExperimentPlatforms from "./index";


describe("app/components/ExperimentPlatforms", () => {
  let mockExperiment, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: "testing",
      title: "Testing Experiment",
      subtitle: "This is a subtitle.",
      subtitle_l10nsuffix: "foo",
      description: "This is a description.",
      created: moment().subtract(2, "months").utc(),
      modified: moment().subtract(2, "months").utc(),
      platforms: []
    };
    props = {
      experiment: mockExperiment
    };
    subject = shallow(<ExperimentPlatforms {...props} />);
  });

  it("should not display platforms if there are none", () => {
    expect(subject.find(".experiment-platform")).to.have.property("length", 0);
  });

  it("should use expected l10n ID and icons for known platforms", () => {
    subject.setProps({
      experiment: {
        ...mockExperiment,
        platforms: ["addon", "ios", "android", "web", "diving", "political"]
      }
    });
    expect(findLocalizedById(subject, "experimentPlatformAddonAndroidIosWeb")).to.have.property("length", 1);
    ["addon", "android", "ios", "web"].forEach(platform =>
      expect(subject.find(`.platform-icon-${platform}`)).to.have.property("length", 1));
    ["diving", "political"].forEach(platform =>
      expect(subject.find(`.platform-icon-${platform}`)).to.have.property("length", 0));
  });
});
