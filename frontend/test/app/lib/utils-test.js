import { expect } from "chai";
import { isFirefox, l10nIdFormat, l10nId, experimentL10nId, lookup } from "../../../src/app/lib/utils";

describe("app/lib/utils", () => {

  describe("l10nIdFormat", () => {
    it("should strip non-alpha characters", () => {
      expect(l10nIdFormat("a_%-b")).to.equal("Ab");
    });

    it("should only capitalize the first letter", () => {
      expect(l10nIdFormat("ABCDE")).to.equal("Abcde");
    });

    it("should coerce integers to strings", () => {
      expect(l10nIdFormat(1)).to.equal("1");
    });
  });

  describe("l10nId", () => {
    it("should join the pieces", () => {
      expect(l10nId(["a", "b", "c"])).to.equal("aBC");
    });

    it("should sanitize each piece", () => {
      expect(l10nId(["A-", "b-", "c-"])).to.equal("aBC");
    });
  });

  const mockLookup = {
    string: "a",
    object: {
      b: "c"
    },
    array: [
      {
        x: "y",
        x_l10nsuffix: "z"
      }
    ],
    string2: "h",
    string2_l10nsuffix: "i",
    stringarray: [
      "item one",
      "item two"
    ],
    stringarray_l10nsuffix: "bar"
  };

  describe("lookup", () => {
    it("should fetch properties of the object", () => {
      expect(lookup(mockLookup, "string")).to.equal(mockLookup.string);
    });

    it("should fetch nested properties", () => {
      expect(lookup(mockLookup, "object.b")).to.equal(mockLookup.object.b);
    });

    it("should fetch array items via index", () => {
      expect(lookup(mockLookup, "array.0.x")).to.equal(mockLookup.array[0].x);
    });
  });

  describe("experimentL10nId", () => {
    const mockExperiment = Object.assign({slug: "foo"}, mockLookup);

    it("should generate the correct l10n ID", () => {
      expect(experimentL10nId(mockExperiment, ["string"])).to.equal("fooString");
    });

    it("should respect _l10nsuffix suffices", () => {
      expect(experimentL10nId(mockExperiment, ["string2"])).to.equal("fooString2I");
    });

    it("handles a string piece by turning it into an array", () => {
      expect(experimentL10nId(mockExperiment, "string")).to.equal("fooString");
    });

    it("looks up object properties", () => {
      expect(experimentL10nId(mockExperiment, ["object", "b"])).to.equal("fooObjectB");
    });

    it("looks up array items", () => {
      expect(experimentL10nId(mockExperiment, ["array", "0", "x"])).to.equal("fooArray0XZ");
    });

    it("looks up arrays of strings", () => {
      expect(experimentL10nId(mockExperiment, ["stringarray", "0"])).to.equal("fooStringarrayBar0");
      expect(experimentL10nId(mockExperiment, ["stringarray", "1"])).to.equal("fooStringarrayBar1");
    });

    it("should return null for a dev-only experiment", () => {
      expect(experimentL10nId({ dev: true, ...mockExperiment }, ["string"])).to.equal(null);
    });
  });

  describe("isFirefox", () => {

    it("should recognize Firefox 58's UA string as Firefox", () => {
      const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:58.0) Gecko/20100101 Firefox/58.0';
      expect(isFirefox(UA)).to.equal(true);
    });

    it("should not recognize Chrome's UA string as Firefox", () => {
      const UA = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
      expect(isFirefox(UA)).to.equal(false);
    });

    it("should not recognize Firefox for iOS/iPod's UA string as Firefox", () => {
      const UA = 'Mozilla/5.0 (iPod touch; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4';
      expect(isFirefox(UA)).to.equal(false);
    });

    it("should not recognize Firefox for iOS/iPhone's UA string as Firefox", () => {
      const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4';
      expect(isFirefox(UA)).to.equal(false);
    });

    it("should not recognize Firefox for iOS/iPad's UA string as Firefox", () => {
      const UA = 'Mozilla/5.0 (iPad; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4';
      expect(isFirefox(UA)).to.equal(false);
    });

  });

});
