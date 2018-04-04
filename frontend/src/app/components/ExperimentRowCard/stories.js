import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object, boolean } from "@storybook/addon-knobs";

import ExperimentRowCard from "./index";
import LayoutWrapper from "../LayoutWrapper";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;

const experiment = {
  title: "Sample experiment",
  description: "This is an example experiment",
  subtitle: "",
  slug: "snooze-tabs",
  survey_url: "https://example.com",
  created: "2010-06-21T12:12:12Z",
  modified: "2010-06-21T12:12:12Z"
};

const baseProps = {
  hasAddon: false,
  enabled: false,
  isFirefox: true,
  isMinFirefox: true,
  experiment: experiment,
  eventCategory: "storybook",
  isAfterCompletedDate: () => false,
  sendToGA: action("sendToGA"),
  installed: {},
  clientUUID: "867-5309"
};

storiesOf("ExperimentRowCard", module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("base state with knobs", () =>
    <ExperimentRowCard
      {...baseProps}
      hasAddon={boolean("Has Addon", false)}
      enabled={boolean("Enabled", false)}
      experiment={object("Experiment", experiment)}
    />
  )
  .add("with subtitle", () =>
    <ExperimentRowCard
      {...baseProps}
      experiment={{ ...experiment, subtitle: "example subtitle here" }}
    />
  )
  .add("just launched", () =>
    <ExperimentRowCard
      {...baseProps}
      experiment={{ ...experiment, created: Date.now() }}
    />
  )
  .add("just updated", () =>
    <ExperimentRowCard
      {...baseProps}
      experiment={{ ...experiment, created: Date.now(), modified: Date.now() }}
    />
  )
  .add("has addon & enabled", () =>
    <ExperimentRowCard {...baseProps} hasAddon={true} enabled={true} />
  )
  .add("has addon & enabled, wrapping title", () =>
    <ExperimentRowCard
      {...baseProps}
      hasAddon={true}
      enabled={true}
      experiment={{ ...experiment, title: "Sample experiment with long title" }}
    />
  )
  .add("ending soon", () =>
    <ExperimentRowCard
      {...baseProps}
      experiment={{ ...experiment, completed: Date.now() + (ONE_WEEK - 1000) }}
    />
  )
  .add("ending tomorrow", () =>
    <ExperimentRowCard
      {...baseProps}
      experiment={{ ...experiment, completed: Date.now() + (ONE_DAY - 1000) }}
    />
  )
  .add("after completed date", () =>
    <ExperimentRowCard {...baseProps} isAfterCompletedDate={() => true} />
  )
  .add("not supported Firefox version", () =>
    <ExperimentRowCard {...baseProps} isMinFirefox={false} isFirefox={false} />
  );
