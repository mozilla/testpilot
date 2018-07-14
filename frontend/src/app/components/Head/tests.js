/* global describe, beforeEach, it */
import React from "react";

import Head from ".";

import { expect } from "chai";
import { shallow } from "enzyme";

describe("app/components/Head", () => {
  let subject, props;

  beforeEach(() => {
    props = {
      metaTitle: "Firefox Test Pilot",
      metaDescription: "Test new Features. Give us feedback. Help build Firefox.",

      imageFacebook: "/static/images/thumbnail-facebook.png",
      imageTwitter: "/static/images/thumbnail-twitter.png",

      availableLocales: "en-US,fr-CA",
      canonicalPath: "canonical/path"
    };

    subject = shallow(<Head {...props} />);
  });

  it("should contain the correct page title", () => {
    expect(subject.find("title").text()).equals(props.metaTitle);
  });

  it("should contain the correct available locales", () => {
    expect(subject.find(`meta [name="availableLanguages"]`).props().content).equals(props.availableLocales);
  });

  it("should contain the correct canonical URL", () => {
    expect(subject.find(`link [rel="canonical"]`).props().href).match(new RegExp(`${props.canonicalPath}$`));
  });

  it("should contain correct Twitter metadata", () => {
    expect(subject.find(`meta [name="twitter:title"]`).props().content).equals(props.metaTitle);
    expect(subject.find(`meta [name="twitter:description"]`).props().content).equals(props.metaDescription);
    expect(subject.find(`meta [name="twitter:image"]`).props().content).equals(props.imageTwitter);
    expect(subject.find(`meta [name="twitter:card"]`).props().content).equals("summary");
  });

  it("should contain correct Facebook metadata", () => {
    expect(subject.find(`meta [property="og:type"]`).props().content).equals("website");
    expect(subject.find(`meta [property="og:title"]`).props().content).equals(props.metaTitle);
    expect(subject.find(`meta [property="og:description"]`).props().content).equals(props.metaDescription);
    expect(subject.find(`meta [property="og:image"]`).props().content).equals(props.imageFacebook);
    expect(subject.find(`meta [property="og:url"]`).props().content).to.match(new RegExp(`${props.canonicalPath}$`));
  });

});
