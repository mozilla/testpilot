import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { findLocalizedById } from "../util";

import NotFoundPage from "../../../src/app/containers/NotFoundPage";


describe("app/containers/NotFoundPage", () => {
  it("should render notFoundHeader string", () => {
    const subject = shallow(<NotFoundPage />);
    expect(findLocalizedById(subject, "notFoundHeader")).to.have.length(1);
  });
});
