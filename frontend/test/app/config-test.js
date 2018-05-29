import { expect } from "chai";

import config from "../../src/app/config";

describe("app/config", () => {
  it("should have experimentsURL", () =>
    expect(config).to.have.property("experimentsURL"));
  it("should specify a minimum Firefox version", () =>
    expect(config).to.have.property("minFirefoxVersion"));
});
