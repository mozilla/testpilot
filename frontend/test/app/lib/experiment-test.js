import { expect } from "chai";
import moment from "moment";
import sinon from "sinon";

import { justLaunched, justUpdated } from "../../../src/app/lib/experiment";

describe("app/lib/experiment", () => {
  describe("justLaunched", () => {
    it("should return true if date is within just launched period", () => {
      expect(justLaunched({
        created: moment().subtract(1, "weeks").utc(),
        modified: 0
      })).to.be.true;
    });

    it("should return false if date is outside of just launched period", () => {
      expect(justLaunched({
        created: moment().subtract(1, "months").utc(),
        modified: 0
      })).to.be.false;
    });

    it("should return false if experiment has just updated", () => {
      expect(justLaunched({
        created: moment().subtract(1, "weeks").utc(),
        modified: moment().subtract(1, "days").utc()
      })).to.be.false;
    });

    it("should return true if date is within just updated period, if not just launched", () => {
      expect(justUpdated({
        created: moment().subtract(3, "months").utc(),
        modified: moment().subtract(1, "weeks").utc()
      })).to.be.true;
    });

    it("should return false if modified property is undefined", () => {
      expect(justUpdated({
        created: moment().subtract(3, "months").utc()
      })).to.be.false;
    });
  });
});
