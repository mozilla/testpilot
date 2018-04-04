/* global describe, beforeEach, it */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import moment from "moment";
import { findLocalizedById } from "../../../../test/app/util";

import ExperimentRowCard from "./index";

const enzymeOptions = {
  context: {
    router: new MemoryRouter()
  },
  childContextTypes: {
    router: sinon.spy()
  }
};

describe("app/components/ExperimentRowCard", () => {
  let mockExperiment, mockClickEvent, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: "testing",
      title: "Testing Experiment",
      subtitle: "This is a subtitle.",
      subtitle_l10nsuffix: "foo",
      description: "This is a description.",
      created: moment().subtract(2, "months").utc(),
      modified: moment().subtract(2, "months").utc()
    };
    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy(),
      target: {
        href: "/foo"
      }
    };
    props = {
      experiment: mockExperiment,
      history: { push: sinon.spy() },
      hasAddon: false,
      enabled: false,
      isFirefox: true,
      isMinFirefox: true,
      eventCategory: "test category",
      sendToGA: sinon.spy(),
      isAfterCompletedDate: sinon.spy()
    };
    subject = shallow(<ExperimentRowCard {...props} />, enzymeOptions);
  });

  it("should render expected content", () => {
    expect(subject.find(".experiment-information header h3").text()).to.equal(mockExperiment.title);
  });

  it("should have the expected l10n ID", () => {
    // Title field not localized; see #1732.
    expect(subject.find("#testingDescription")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "testingTitle")).to.have.property("length", 0);
    expect(findLocalizedById(subject, "testingSubtitleFoo")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "testingDescription")).to.have.property("length", 1);
  });

  it("should not have l10n IDs if the experiment is dev-only", () => {
    subject.setProps({ experiment: { dev: true, ...props.experiment } });
    expect(findLocalizedById(subject, "testingSubtitleFoo")).to.have.property("length", 0);
    expect(findLocalizedById(subject, "testingDescription")).to.have.property("length", 0);
  });

  it("should change style based on hasAddon", () => {
    expect(subject.find(".experiment-summary").hasClass("has-addon")).to.be.false;
    subject.setProps({ hasAddon: true });
    expect(subject.find(".experiment-summary").hasClass("has-addon")).to.be.true;
  });

  it('should display an "enabled" banner if the experiment is enabled', () => {
    expect(subject.find(".experiment-summary").hasClass("enabled")).to.be.false;
    expect(subject.find(".enabled-tab")).to.have.property("length", 0);

    subject.setProps({ enabled: true });

    expect(subject.find(".experiment-summary").hasClass("enabled")).to.be.true;
    expect(subject.find(".enabled-tab")).to.have.property("length", 1);
  });

  it("should display a feedback button if the experiment is enabled", () => {
    expect(subject.find(".experiment-feedback")).to.have.property("length", 0);

    subject.setProps({ enabled: true });

    expect(subject.find(".experiment-feedback")).to.have.property("length", 1);
  });

  it("should ping GA when feedback is clicked", () => {
    subject.setProps({ enabled: true });
    subject.find(".experiment-feedback").simulate("click", mockClickEvent);

    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: props.eventCategory,
      eventAction: "Give Feedback",
      eventLabel: mockExperiment.title,
      dimension11: mockExperiment.slug
    }]);
  });

  it('should display "just launched" banner if created date within 2 weeks, never seen, and not enabled', () => {
    expect(subject.find(".experiment-summary").hasClass("just-launched")).to.be.false;
    expect(subject.find(".just-launched-tab")).to.have.property("length", 0);

    subject.setProps({
      enabled: false,
      experiment: { ...mockExperiment,
        created: moment().subtract(1, "week").utc()
      }
    });

    expect(subject.find(".experiment-summary").hasClass("just-launched")).to.be.true;
    expect(subject.find(".just-launched-tab")).to.have.property("length", 1);

    subject.setProps({ enabled: true });

    expect(subject.find(".experiment-summary").hasClass("just-launched")).to.be.false;
    expect(subject.find(".just-launched-tab")).to.have.property("length", 0);

    subject.setProps({
      enabled: true
    });

    expect(subject.find(".experiment-summary").hasClass("just-launched")).to.be.false;
    expect(subject.find(".just-launched-tab")).to.have.property("length", 0);
  });

  it('should display "just updated" banner if modified date within 2 weeks, not enabled, and not just launched', () => {
    expect(subject.find(".experiment-summary").hasClass("just-updated")).to.be.false;
    expect(subject.find(".just-updated-tab")).to.have.property("length", 0);

    props = { ...props,
      enabled: false,
      experiment: { ...mockExperiment,
        modified: moment().subtract(1, "week").utc()
      }
    };
    subject.setProps(props);

    expect(subject.find(".experiment-summary").hasClass("just-updated")).to.be.true;
    expect(subject.find(".just-updated-tab")).to.have.property("length", 1);

    subject.setProps({ enabled: true });

    expect(subject.find(".experiment-summary").hasClass("just-updated")).to.be.false;
    expect(subject.find(".just-updated-tab")).to.have.property("length", 0);
  });

  it('should show a "tomorrow" status message when ending in one day', () => {
    expect(findLocalizedById(subject, "experimentListEndingTomorrow")).to.have.property("length", 0);
    subject.setProps({ experiment: { ...mockExperiment,
      completed: moment().add(23, "hours").utc()
    } });
    expect(findLocalizedById(subject, "experimentListEndingTomorrow")).to.have.property("length", 1);
  });

  it('should show a "soon" status message when ending in one week', () => {
    expect(findLocalizedById(subject, "experimentListEndingSoon")).to.have.property("length", 0);
    subject.setProps({ experiment: { ...mockExperiment,
      completed: moment().add(6, "days").utc()
    } });
    expect(findLocalizedById(subject, "experimentListEndingSoon")).to.have.property("length", 1);
  });

  it('should have a "Learn More" button if the experiment is completed', () => {
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 0);
    subject.setProps({
      experiment: { ...mockExperiment,
        completed: moment().subtract(1, "days").utc()
      },
      isAfterCompletedDate: () => true
    });
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "participantCount")).to.have.property("length", 0);
  });

  it('should have a "Learn More" button if the browser is not supported Firefox', () => {
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 0);
    subject.setProps({
      experiment: { ...mockExperiment },
      isFirefox: false,
      isMinFirefox: false
    });
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 1);
  });

  it('should have a "Manage" button if the experiment is enabled and has an addon', () => {
    expect(findLocalizedById(subject, "experimentCardManage")).to.have.property("length", 0);
    subject.setProps({
      enabled: true,
      hasAddon: true
    });
    expect(findLocalizedById(subject, "experimentCardManage")).to.have.property("length", 1);
  });

  it("should ping GA when manage is clicked", () => {
    subject.find(".experiment-summary").simulate("click", mockClickEvent);
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: props.eventCategory,
      eventAction: "Open detail page",
      eventLabel: mockExperiment.title,
      dimension11: mockExperiment.slug
    }, mockClickEvent]);
  });
});
