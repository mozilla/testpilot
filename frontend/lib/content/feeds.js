const Feed = require("feed");
const config = require("../../config.js");
const { extractNewsUpdates } = require("./utils");

module.exports = ({ inputs: { experiments, news_updates } }) => {
  const feed = new Feed({
    title: "Test Pilot News Updates",
    description: "News Updates for Test Pilot experiments",
    id: "https://blog.mozilla.org/testpilot",
    link: "https://blog.mozilla.org/testpilot",
    favicon: "https://testpilot.firefox.com/static/images/favicon.ico",
    feedLinks: {
      rss: "https://testpilot.firefox.com/feed.rss",
      atom: "https://testpilot.firefox.com/feed.atom",
      json: "https://testpilot.firefox.com/feed.json"
    },
    author: {
      name: "Mozilla",
      link: "https://testpilot.firefox.com"
    }
  });

  extractNewsUpdates(experiments, news_updates).forEach(
    ({ experimentSlug, title, slug = "", link, published, content }) => {
      const item = { title, content, date: published };
      if (link) {
        item.link = link;
      } else if (experimentSlug) {
        item.link = `https://testpilot.firefox.com/experiments/${experimentSlug}/#${slug}`;
      } else {
        item.link = `https://testpilot.firefox.com/experiments/#${slug}`;
      }
      feed.addItem(item);
    }
  );

  return {
    "feed.rss": feed.rss2(),
    "feed.atom": feed.atom1(),
    "feed.json": feed.json1()
  };
};
