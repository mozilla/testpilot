/* global describe, beforeEach, it */
import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import HomePage from "./index";
import HomePageNoAddon from "./HomePageNoAddon";
import HomePageWithAddon from "./HomePageWithAddon";
import NewsUpdateDialog from "../../components/NewsUpdatesDialog";

const today = new Date();
const twoWeeksAgo = today - 1000 * 60 * 60 * 24 * 15;
const twoDaysAgo = today - 1000 * 60 * 60 * 24 * 2;
const oneDayAgo = today - 1000 * 60 * 60 * 24 * 1;
const enzymeOptions = {
  context: {
    router: new MemoryRouter()
  },
  childContextTypes: {
    router: sinon.spy()
  }
};

describe("app/containers/HomePage", () => {
  let props, subject;
  beforeEach(function() {
    props = {
      experiments: [],
      experimentsWithoutFeatured: [],
      hasAddon: false,
      isFirefox: false
    };
    subject = shallow(<HomePage {...props} />);
  });

  it("should return HomePageNoAddon if hasAddon is false", () => {
    expect(subject.find("HomePageNoAddon")).to.have.property("length", 1);
    expect(subject.find("HomePageWithAddon")).to.have.property("length", 0);
  });

  it("should return HomePageWithAddon if hasAddon is true", () => {
    subject.setProps({ hasAddon: true });
    expect(subject.find("HomePageWithAddon")).to.have.property("length", 1);
    expect(subject.find("HomePageNoAddon")).to.have.property("length", 0);
  });
});

describe("app/containers/HomePageNoAddon", () => {
  let props, subject;
  beforeEach(function() {
    props = {
      experiments: [],
      featuredExperiments: [],
      experimentsWithoutFeatured: [],
      hasAddon: false,
      isFirefox: false,
      uninstallAddon: sinon.spy(),
      sendToGA: sinon.spy(),
      isAfterCompletedDate: sinon.spy(x => !!x.completed)
    };
    subject = shallow(<HomePageNoAddon {...props} />);
  });

  it("should return nothing if no experiments are available", () => {
    subject.setProps({ experiments: [], experimentsWithoutFeatured: [] });
    expect(subject.find("#landing-page")).to.have.property("length", 0);
  });

  it("should render default content with experiments loaded", () => {
    const experiments = [ { title: "foo" }, { title: "bar" } ];
    const experimentsWithoutFeatured = [ { title: "foo" }, { title: "bar" } ];
    subject.setProps({ experiments, experimentsWithoutFeatured });
    expect(findLocalizedById(subject, "landingIntroOne")).to.have.property("length", 1);
    expect(subject.find("ExperimentCardList")).to.have.property("length", 1);
  });

  it("should render featured experiment section if there is a featured experiment", () => {
    expect(subject.find("FeaturedExperiment")).to.have.property("length", 0);

    const experiments = [ { title: "foo" }, { title: "bar" } ];
    const featuredExperiments = [ { title: "bar" } ];
    const experimentsWithoutFeatured = [ { title: "foo" } ];
    const isExperimentEnabled = () => true;
    subject.setProps({ experiments, featuredExperiments, experimentsWithoutFeatured, isExperimentEnabled });
    expect(subject.find("FeaturedExperiment")).to.have.property("length", 1);
  });

  it("should not display completed experiments", () => {
    const experiments = [ { title: "foo" }, { title: "bar", completed: "2016-10-01" } ];
    const experimentsWithoutFeatured = [ { title: "foo" }, { title: "bar", completed: "2016-10-01" } ];
    subject.setProps({ experiments, experimentsWithoutFeatured });
    const xs = subject.find("ExperimentCardList").prop("experiments");
    expect(xs.length).to.equal(1);
    expect(xs[0].title).to.equal("foo");
  });

});

describe("app/containers/HomePageWithAddon", () => {
  let props, subject;
  beforeEach(function() {
    props = {
      featuredExperiments: [],
      experiments: [ { title: "foo" }, { title: "bar" }, {title: "featured", is_featured: true} ],
      experimentsWithoutFeatured: [ { title: "foo" }, { title: "bar" } ],
      hasAddon: true,
      uninstallAddon: sinon.spy(),
      newsletterForm: {succeeded: true},
      majorNewsUpdates: [
        {
          experimentSlug: "min-vid",
          slug: "min-vid-update-1",
          title: "update shouldnt show since its more than 2 weeks old",
          link: "https://medium.com/firefox-test-pilot",
          major: true,
          created: new Date(twoWeeksAgo).toISOString(),
          published: new Date(twoWeeksAgo).toISOString(),
          image: "http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg",
          content: "update shouldnt show since its more than 2 weeks old"},
        {
          experimentSlug: "min-vid",
          slug: "min-vid-update-2",
          title: "update should be 2nd in carousel",
          link: "https://medium.com/firefox-test-pilot",
          major: true,
          created: new Date(twoDaysAgo).toISOString(),
          published: new Date(twoDaysAgo).toISOString(),
          image: "http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg",
          content: "Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well."},
        {
          experimentSlug: "min-vid",
          slug: "min-vid-update-3",
          title: "Another update, should be shown 1st in the carousel since it is fresher",
          link: "https://medium.com/firefox-test-pilot",
          major: true,
          created: new Date(oneDayAgo).toISOString(),
          published: new Date(oneDayAgo).toISOString(),
          image: "http://www.revelinnewyork.com/sites/default/files/RatMay8-21%2C1970_jpg.jpg",
          content: "Min Vid 1.1.0 just shipped with enhanced browser support and a few other improvements as well."
        }
      ],
      isExperimentEnabled: sinon.spy(),
      getCookie: sinon.spy(),
      removeCookie: sinon.spy(),
      getWindowLocation: sinon.spy(() => ({ search: "" })),
      subscribeToBasket: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy(),
      isAfterCompletedDate: sinon.spy(x => !!x.completed)
    };
    subject = shallow(<HomePageWithAddon {...props} />, enzymeOptions);
  });

  it("should render expected content", () => {
    expect(subject.state("showEmailDialog")).to.be.false;
    expect(subject.find("ExperimentCardList")).to.have.property("length", 1);
    expect(subject.find("EmailDialog")).to.have.property("length", 0);
  });

  it("should not show anything if no experiments are available", () => {
    subject.setProps({ experiments: [], experimentsWithoutFeatured: [] });
    expect(subject.find("View")).to.have.property("length", 0);
  });

  it("should render featured experiment section if there is a featured experiment", () => {
    expect(subject.find("FeaturedExperiment")).to.have.property("length", 0);

    const experiments = [ { title: "foo" }, { title: "bar" }, {title: "featured", is_featured: true} ];
    const experimentsWithoutFeatured = [ { title: "foo" }, { title: "bar" } ];
    const featuredExperiments = [ {title: "featured", is_featured: true} ];
    subject.setProps({ experiments, featuredExperiments, experimentsWithoutFeatured });
    expect(subject.find("FeaturedExperiment")).to.have.property("length", 1);
  });

  it("should show an email dialog if the txp-installed cookie exists", () => {
    const getCookie = sinon.stub();
    getCookie.withArgs("txp-installed").onFirstCall().returns("1");
    getCookie.returns(null);
    props = { ...props, getCookie };
    subject = shallow(<HomePageWithAddon {...props} />);
    expect(subject.find("EmailDialog")).to.have.property("length", 1);
    subject.setState({ showEmailDialog: false });
    expect(subject.find("EmailDialog")).to.have.property("length", 0);
  });

  it("should show news update dialog if valid news updates are available", () => {
    window.localStorage = {
      getItem: () => {}
    };
    subject = shallow(<HomePageWithAddon {...props} />, enzymeOptions);
    expect(subject.find(NewsUpdateDialog)).to.have.property("length", 1);

    subject = shallow(<HomePageWithAddon {...props} majorNewsUpdates={[]} />, enzymeOptions);
    expect(subject.find(NewsUpdateDialog)).to.have.property("length", 0);
  });
});
