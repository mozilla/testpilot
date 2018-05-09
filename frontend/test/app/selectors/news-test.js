import { expect } from "chai";

import newsUpdatesSelector, {
  publishedFilter,
  experimentUpdateAvailable,
  makeNewsUpdatesForDialogSelector
} from "../../../src/app/selectors/news";

describe("app/selectors/news", () => {
  describe("publishedFilter", () => {
    it('should return false if update does not have "published" field', () => {
      expect(publishedFilter({
        experimentSlug: "exp3",
        created: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      })).to.be.false;

      expect(publishedFilter({
        experimentSlug: "exp3",
        published: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      })).to.be.true;
    });

    it('should return false if "published" field in update is a date in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      expect(publishedFilter({
        experimentSlug: "exp3",
        published: futureDate.toISOString(),
        title: "Exp3 News Item 1"
      })).to.be.false;
    });

    it('should return true if "published" field in update is a date in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      expect(publishedFilter({
        experimentSlug: "exp3",
        published: pastDate.toISOString(),
        title: "Exp3 News Item 1"
      })).to.be.true;
    });
  });

  describe("experimentUpdateAvailable", () => {
    it("should return true if update does NOT include experimentSlug", () => {
      const availableExperiments = new Set(["exp1",  "exp2"]);
      expect(experimentUpdateAvailable({
        published: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      }, availableExperiments)).to.be.true;
    });

    it('should return correctly based on whether "experimentSlug", is in the passed "availableExperiments"', () => {
      const availableExperiments = new Set(["exp1",  "exp2"]);
      expect(experimentUpdateAvailable({
        experimentSlug: "exp1",
        published: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      }, availableExperiments)).to.be.true;

      expect(experimentUpdateAvailable({
        experimentSlug: "exp3",
        published: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      }, availableExperiments)).to.be.false;
    });
  });

  describe("newsUpdatesSelector", () => {
    it("should gather available news updates from all available experiments", () => {
      const result = experimentSlugsSet(newsUpdatesSelector(makeStore()));
      expect(result.has("exp1")).to.be.true;
      expect(result.has("exp2")).to.be.true;
      expect(result.has("exp3")).to.be.false;
    });

    it("should include Test Pilot general updates", () => {
      const result = newsUpdatesSelector(makeStore())
        .filter(update => !update.experimentSlug)
        .map(update => update.title);
      expect(result).to.deep.equal(["Test Pilot Item 2", "Test Pilot Item 1"]);
    });

    it("should sort news updates in reverse-chronological order", () => {
      const result = newsUpdatesSelector(makeStore()).map(
        update => update.published
      );
      expect(result).to.deep.equal([
        "2017-06-02T12:00:00Z",
        "2017-06-01T12:00:00Z",
        "2017-05-30T12:00:00Z",
        "2017-05-29T12:00:00Z",
        "2017-05-28T13:00:00Z",
        "2017-05-17T13:00:00Z"
      ]);
    });
  });

  const makeNewsUpdateSelectorAgeTest = (useStale, useLastViewed) => () => {
    const today = Date.now();
    const twoWeeksAgo = today - 2 * 7 * 24 * 60 * 60 * 1000;
    const yesterday = today - (24 * 60 * 60 * 1000);
    const store = makeStore();
    const updates = store.news.updates;
    const freshCount = 4;
    const lastViewedDate = new Date(yesterday).toISOString();

    for (let i = 0; i < updates.length; i++) {
      // HACK: Since this is time dependent, give this a couple seconds of
      // wiggle room around the two-week mark
      let dt;
      if (i < freshCount) {
        dt = [today, yesterday, twoWeeksAgo + 2000][i % 3];
      } else {
        dt = twoWeeksAgo - 2000;
      }
      const key = ["published", "created"][i % 2];
      updates[i][key] = new Date(dt).toISOString();
    }

    const selector = makeNewsUpdatesForDialogSelector(lastViewedDate, today);

    // Filter result to assert no updates contradict the selector
    const shouldBeEmpty = selector(store)
      .map(update => new Date(update.published || update.created).getTime())
      .filter(
        dt =>
          useLastViewed
          ? dt > yesterday
          : useStale
            ? dt >= twoWeeksAgo // fresh news from stale selector is a failure
            : dt < twoWeeksAgo // stale news from fresh selector is a failure
      );

    // An empty list should be the end result.
    expect(shouldBeEmpty).to.have.property("length", 0);
  };

  describe("makeFreshNewsUpdatesSinceLastViewedSelector", () => {
    it(
      "should only produce updates since last viewed and major",
      makeNewsUpdateSelectorAgeTest(false, true)
    );
  });
});

const titleSet = updates => new Set(updates.map(update => update.title));

const experimentSlugsSet = updates =>
  new Set(updates.map(update => update.experimentSlug));

const makeStore = () => ({
  browser: {
    isDev: false
  },
  experiments: {
    data: [{ slug: "exp1" }, { slug: "exp2" }]
  },
  news: {
    updates: [
      {
        published: "2017-06-01T12:00:00Z",
        title: "Test Pilot Item 1"
      },
      {
        published: "2017-06-02T12:00:00Z",
        title: "Test Pilot Item 2"
      },
      {
        experimentSlug: "exp1",
        published: "2017-05-29T12:00:00Z",
        title: "Exp1 News Item 1"
      },
      {
        experimentSlug: "exp1",
        published: "2017-05-28T13:00:00Z",
        title: "Exp1 News Item 2"
      },
      {
        experimentSlug: "exp1",
        published: "2099-10-24T12:12:12Z",
        title: "Exp1 future update"
      },
      {
        experimentSlug: "exp2",
        published: "2017-05-30T12:00:00Z",
        title: "Exp2 News Item 1"
      },
      {
        experimentSlug: "exp2",
        published: "2017-05-17T13:00:00Z",
        title: "Exp2 News Item 2"
      },
      {
        experimentSlug: "exp3",
        published: "2017-05-30T12:00:00Z",
        title: "Exp3 News Item 1"
      },
      {
        experimentSlug: "exp3",
        published: "2017-05-17T13:00:00Z",
        title: "Exp3 News Item 2"
      }
    ]
  }
});
