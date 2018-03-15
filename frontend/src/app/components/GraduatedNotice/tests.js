/* global describe, beforeEach, it */
import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "chai";
import { mount } from "enzyme";

import GraduatedNotice from "./index";

const TEST_URL = "https://medium.com/firefox-test-pilot";

describe("app/components/GraduatedNotice", () => {
  let subject;
  beforeEach(() => {
    subject = mount(<MemoryRouter><GraduatedNotice graduation_url={TEST_URL} /></MemoryRouter>);
  });

  it("should render expected content", () => {
    expect(subject.find(
      ".graduated-notice-text h1"
    ).text()).to.equal("This experiment has ended");
  });

  it("should link to the graduation url if provided", () => {
    expect(subject.find(
      ".graduated-notice-button"
    ).props()).to.have.property("href", TEST_URL);
  });
});

