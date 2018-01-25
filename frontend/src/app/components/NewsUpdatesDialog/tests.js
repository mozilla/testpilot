/* global describe, beforeEach, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import NewsUpdatesDialog from "./index";

const today = new Date();
const twoDaysAgo = today - (1000 * 60 * 60 * 24 * 2);
const oneDayAgo = today - (1000 * 60 * 60 * 24 * 1);
const newsUpdates = [{
  experimentSlug: "min-vid",
  slug: "min-vid-update-2",
  title: "update should be 2nd in carousel",
  link: "https://medium.com/firefox-test-pilot",
  created: new Date(twoDaysAgo).toISOString(),
  published: new Date(twoDaysAgo).toISOString(),
  image: "http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg",
  content: "Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well."
}, {
  experimentSlug: "min-vid",
  slug: "min-vid-update-3",
  title: "Another update, should be shown 1st in the carousel since it is fresher",
  link: "https://medium.com/firefox-test-pilot",
  created: new Date(oneDayAgo).toISOString(),
  published: new Date(oneDayAgo).toISOString(),
  image: "http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg",
  content: "Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well."
}];

describe("app/components/NewsUpdatesDialog", () => {
  let props, subject;
  beforeEach(() => {
    props = {
      newsUpdates: newsUpdates,
      isExperimentEnabled: () => true,
      onCancel: sinon.spy(),
      onComplete: sinon.spy(),
      stepNextPing: sinon.spy(),
      stepBackPing: sinon.spy(),
      stepToDotPing: sinon.spy()
    };
    subject = mount(<NewsUpdatesDialog {...props} />);
  });

  it("should render expected content", () => {
    expect(subject.find(".step-title").first().text()).to.equal(newsUpdates[0].title);
  });

  it('should display an "enabled" banner if the experiment is enabled', () => {
    expect(subject.find(".modal-header").hasClass("enabled")).to.be.true;
  });

  it("should have the expected l10n ID", () => {
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "viewExperimentPage")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "nonExperimentDialogHeaderLink")).to.have.property("length", 0);

    subject.setProps({ newsUpdates: [Object.assign(newsUpdates[0], { experimentSlug: null })] });

    expect(findLocalizedById(subject, "nonExperimentDialogHeaderLink")).to.have.property("length", 1);
    expect(findLocalizedById(subject, "viewExperimentPage")).to.have.property("length", 0);
  });

  it("should show learn more link if there is a blog post link", () => {
    expect(findLocalizedById(subject, "experimentCardLearnMore")).to.have.property("length", 1);

    subject.setProps({ newsUpdates: [Object.assign(newsUpdates[0], { link: null })] });

    expect(findLocalizedById(subject, "learnMoreLink")).to.have.property("length", 0);
  });
});
