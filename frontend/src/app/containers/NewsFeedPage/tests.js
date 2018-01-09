/* global describe, it */
import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import NewsFeedPage from "./index";

const mockRequiredProps = {
  protocol: "https:",
  isMinFirefox: true,
  sendToGA: sinon.spy(),
  isDevHost: false,
  isProdHost: true,
  initialShowMoreNews: true,
  hideHeader: true,
  experiments: [
    { slug: "exp0" },
    { slug: "exp1" }
  ],
  freshNewsUpdates: [
    { slug: "foo", experimentSlug: "exp1" },
    { slug: "bar" }
  ],
  staleNewsUpdates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => ({ slug: `stale-${idx}` }))
};

describe("app/containers/NewsFeedPage", () => {
  it("should render updates if updates are available", () => {
    const wrapper = shallow(<NewsFeedPage {...mockRequiredProps} />);
    expect(wrapper.find("UpdateList")).to.have.property("length", 1);
  });

  it("should not show header to updateList", () => {
    const wrapper = shallow(<NewsFeedPage {...mockRequiredProps} />);
    expect(findLocalizedById(wrapper, "latestUpdatesTitle")).to.have.property("length", 0);
  });
});
