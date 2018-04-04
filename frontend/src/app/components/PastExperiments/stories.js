import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PastExperiments from "./index";
import LayoutWrapper from "../LayoutWrapper";

const experiments = [{
  title: "Sample experiment",
  description: "This is an example experiment",
  subtitle: "",
  slug: "snooze-tabs",
  survey_url: "https://example.com",
  created: "2010-06-21T12:12:12Z",
  modified: "2010-06-21T12:12:12Z"
}, {
  title: "Another sample",
  description: "This is a different experiment",
  subtitle: "A subtitle",
  slug: "pulse",
  enabled: true,
  survey_url: "https://example.com",
  created: "2010-06-21T12:12:12Z",
  modified: "2010-06-21T12:12:12Z"
}];

const baseProps = {
  pastExperiments: experiments,
  hasAddon: false,
  enabled: false,
  isFirefox: true,
  isMinFirefox: true,
  eventCategory: "storybook",
  isAfterCompletedDate: () => false,
  isExperimentEnabled: (e) => e.enabled === true,
  sendToGA: action("sendToGA"),
  installed: {},
  clientUUID: "867-5309"
};

storiesOf("PastExperiments", module)
  .addDecorator(story =>
    <div className="blue" style={{ padding: 10 }} onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("base state", () =>
    <PastExperiments
      {...baseProps}
    />
  );
