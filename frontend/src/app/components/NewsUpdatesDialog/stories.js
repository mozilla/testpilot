import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import NewsUpdatesDialog from "./index";
import LayoutWrapper from "../LayoutWrapper";

const time = Date.now();

// quick & dirty utility to make canned news updates
const mkupdate = (daysAgo, slug, experimentSlug, title, content, rest) => {
  const dt = time - (daysAgo * 24 * 60 * 60 * 1000);
  return Object.assign(
    {
      slug,
      experimentSlug,
      title,
      content,
      created: new Date(dt - 1000).toISOString(),
      published: new Date(dt).toISOString(),
      image: "/static/images/experiments/min-vid/experiments_experimentdetail/detail1.jpg"
    },
    rest || {}
  );
};

const baseProps = {
  sendToGA: action("sendToGA"),
  onCancel: () => {},
  onComplete: () => {},
  isExperimentEnabled: () => true,
  newsUpdates: []
};

const txpUpdate = mkupdate(
  1,
  "story-999",
  null,
  "Blog Post #1",
  "This is an example update with a blog post link"
);

const experimentUpdateFull = mkupdate(
  2,
  "story-123",
  "min-vid",
  "Example Update #1",
  "This is an example update",
  { link: "https://medium.com/firefox-test-pilot" }
);

const experimentUpdateNoLink = mkupdate(
  3,
  "story-456",
  "dev-example",
  "Example Update #2",
  "This is another example update"
);

storiesOf("NewsUpdatesDialog", module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="content-wrapper" onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("testpilot update", () => <NewsUpdatesDialog {...baseProps} newsUpdates={[txpUpdate]}/>)
  .add("experiment update full", () => <NewsUpdatesDialog {...baseProps} newsUpdates={[experimentUpdateFull]}/>)
  .add("experiment update no link", () => <NewsUpdatesDialog {...baseProps} newsUpdates={[experimentUpdateNoLink]}/>)
  .add("disabled experiment update", () => <NewsUpdatesDialog {...baseProps} isExperimentEnabled={() => false} newsUpdates={[experimentUpdateNoLink]}/>)
  .add("all updates", () => <NewsUpdatesDialog {...baseProps} newsUpdates={[txpUpdate, experimentUpdateFull, experimentUpdateNoLink]}/>);
