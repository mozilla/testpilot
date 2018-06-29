/* global describe, beforeEach, it */
import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import moment from "moment";

import { findLocalizedById } from "../../../../test/app/util";

import FeaturedExperiment from "./index";
import FeaturedStatus from "./FeaturedStatus";
import FeaturedButton from "./FeaturedButton";

describe("app/components/FeaturedExperiment", () => {
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
      platforms: ["addon"]
    };
    props = {
      experiment: mockExperiment,
      hasAddon: false,
      enabled: false,
      isFirefox: true,
      isMinFirefox: true,
      installed: [],
      eventCategory: "test category",
      sendToGA: sinon.spy(),
      isExperimentEnabled: sinon.spy()
    };
    const component = shallow(<MemoryRouter><FeaturedExperiment {...props} /></MemoryRouter>);
    subject = component.find(FeaturedExperiment).dive();
  });

  it("should render expected content", () => {
    expect(subject.find(".featured-experiment__title").text()).to.equal(mockExperiment.title);
  });

  it("should have the expected l10n ID", () => {
    expect(findLocalizedById(subject, "testing")).to.have.property("length", 0);
    expect(findLocalizedById(subject, "testingSubtitleFoo")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "testingDescription")).to.have.property("length", 1);
  });

  it('should have a "More Detail" button if not enabled', () => {
    subject.setProps({ enabled: true });
    expect(findLocalizedById(subject, "moreDetail")).to.have.property("length", 0);
    subject.setProps({ enabled: false });
    expect(findLocalizedById(subject, "moreDetail")).to.have.property("length", 1);
  });
});


describe("app/components/FeaturedStatus", () => {
  let mockExperiment, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: "testing",
      title: "Testing Experiment",
      subtitle: "This is a subtitle.",
      subtitle_l10nsuffix: "foo",
      description: "This is a description.",
      created: moment().subtract(1, "week").utc(),
      modified: null
    };
    props = {
      experiment: mockExperiment,
      enabled: false
    };
    const component = shallow(<MemoryRouter><FeaturedStatus {...props} /></MemoryRouter>);
    subject = component.find(FeaturedStatus).dive();
  });

  it("should show just launched if launched within 2 weeks", () => {
    expect(subject.find(".just-launched-tab")).to.have.property("length", 1);
  });

  it("should show just updated if modified within 2 weeks", () => {
    mockExperiment.created = moment().subtract(2, "week").utc();
    mockExperiment.modified =  moment().subtract(1, "week").utc();

    subject.setProps({
      experiment: mockExperiment
    });

    expect(subject.find(".just-updated-tab")).to.have.property("length", 1);
  });

  it("should show just updated over just launched", () => {
    mockExperiment.created = moment().subtract(1, "week").utc();
    mockExperiment.modified =  moment().subtract(1, "week").utc();

    subject.setProps({
      experiment: mockExperiment
    });
    expect(subject.find(".just-updated-tab")).to.have.property("length", 1);
  });

  it("should show enabled over just launched or just updated", () => {
    mockExperiment.created = moment().subtract(1, "week").utc();
    mockExperiment.modified =  moment().subtract(1, "week").utc();

    subject.setProps({
      enabled: true,
      experiment: mockExperiment
    });

    expect(subject.find(".enabled-tab")).to.have.property("length", 1);
  });

  it('should display "just updated" banner if modified date within 2 weeks, not enabled, and no just launched', () => {
    expect(subject.find(".just-updated-tab")).to.have.property("length", 0);

    props = { ...props,
      enabled: false,
      experiment: { ...mockExperiment,
        modified: moment().subtract(1, "week").utc()
      }
    };
    subject.setProps(props);

    expect(subject.find(".just-updated-tab")).to.have.property("length", 1);

    subject.setProps({ enabled: true });

    expect(subject.find(".just-updated-tab")).to.have.property("length", 0);
  });

  it('should display "just launched" banner if created date within 2 weeks, never seen, and not enabled', () => {
    subject.setProps({ enabled: true });
    expect(subject.find(".just-launched-tab")).to.have.property("length", 0);

    subject.setProps({
      enabled: false,
      experiment: { ...mockExperiment,
        created: moment().subtract(1, "week").utc()
      }
    });

    expect(subject.find(".just-launched-tab")).to.have.property("length", 1);
  });
});

describe("app/components/FeaturedButton", () => {
  let mockExperiment, mockClickEvent, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: "testing",
      title: "Testing Experiment",
      subtitle: "This is a subtitle.",
      subtitle_l10nsuffix: "foo",
      description: "This is a description.",
      created: moment().subtract(1, "week").utc(),
      modified: moment().subtract(1, "week").utc(),
      platforms: ["web"]
    };
    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy(),
      target: {
        href: "/foo"
      }
    };
    props = {
      enabled: false,
      experiment: mockExperiment,
      hasAddon: false,
      installed: [],
      sendToGA: sinon.spy()
    };
    const component = shallow(<MemoryRouter><FeaturedButton {...props} /></MemoryRouter>);
    subject = component.find(FeaturedButton).dive();
  });

  it("should show manage and feedback buttons if enabled and hasAddon", () => {
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    expect(subject.find(".manage-button")).to.have.property("length", 1);
  });

  it("should show MainInstallButton if not enabled or without addon", () => {
    expect(subject.find("MainInstallButton")).to.have.property("length", 1);

    subject.setProps({
      enabled: true,
      hasAddon: false
    });

    expect(subject.find("MainInstallButton")).to.have.property("length", 1);

    subject.setProps({
      enabled: false,
      hasAddon: true
    });

    expect(subject.find("MainInstallButton")).to.have.property("length", 1);
  });

  it("should call sendToGA when manage button clicked", () => {
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    subject.find(".manage-button").simulate("click", mockClickEvent);

    expect(props.sendToGA.lastCall.args.slice(0, 2)).to.deep.equal(["event", {
      eventCategory: props.eventCategory,
      eventAction: "button click",
      eventLabel: "Manage Featured Button",
      dimension1: true,
      dimension2: false,
      dimension3: 0,
      dimension4: true,
      dimension5: "Testing Experiment",
      dimension11: mockExperiment.slug,
      dimension13: "Featured Experiment"
    }]);
  });

  it("should call sendToGA when feedback button clicked", () => {
    subject.setProps({
      enabled: true,
      hasAddon: true
    });

    subject.find(".featured-feedback").simulate("click", mockClickEvent);

    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: props.eventCategory,
      eventAction: "button click",
      eventLabel: "Feedback Featured Button",
      dimension1: true,
      dimension2: false,
      dimension3: 0,
      dimension4: true,
      dimension5: "Testing Experiment",
      dimension11: mockExperiment.slug,
      dimension13: "Featured Experiment"
    }, mockClickEvent]);
  });

  it('should have a "Manage" button if the experiment is enabled and has an addon', () => {
    expect(findLocalizedById(subject, "experimentCardManage")).to.have.property("length", 0);
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    expect(findLocalizedById(subject, "experimentCardManage")).to.have.property("length", 1);
  });

  it("should display a feedback button if the experiment is enabled", () => {
    expect(subject.find(".featured-experiment__enabled-buttons")).to.have.property("length", 0);

    subject.setProps({ enabled: true, hasAddon: true });

    expect(subject.find(".featured-experiment__enabled-buttons")).to.have.property("length", 1);
  });
});
