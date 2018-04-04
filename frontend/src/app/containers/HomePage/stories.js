import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Visibility from "../../components/Visibility";
import Banner from "../../components/Banner";
import LayoutWrapper from "../../components/LayoutWrapper";
import ExperimentCardList from "../../components/ExperimentCardList";

import "./index.scss";

const experiments = [
  {
    title: "Sample experiment",
    description: "This is an example experiment",
    subtitle: "",
    slug: "snooze-tabs",
    survey_url: "https://example.com",
    created: "2010-06-21T12:12:12Z",
    modified: "2010-06-21T12:12:12Z"
  },
  {
    title: "Another sample",
    description: "This is a different experiment",
    subtitle: "A subtitle",
    slug: "pulse",
    enabled: true,
    survey_url: "https://example.com",
    created: "2010-06-21T12:12:12Z",
    modified: "2010-06-21T12:12:12Z"
  },
  {
    title: "Yet another",
    description: "This is a different experiment",
    subtitle: "A subtitle",
    slug: "min-vid",
    enabled: false,
    survey_url: "https://example.com",
    created: "2010-06-21T12:12:12Z",
    modified: "2010-06-21T12:12:12Z"
  }
];

const cardListProps = {
  experiments,
  hasAddon: false,
  enabled: false,
  isFirefox: true,
  isMinFirefox: true,
  eventCategory: "storybook",
  getExperimentLastSeen: () => Date.now(),
  isAfterCompletedDate: () => false,
  isExperimentEnabled: e => e.enabled === true,
  sendToGA: action("sendToGA"),
  installed: {},
  clientUUID: "867-5309"
};

storiesOf("HomePage", module)
  .addDecorator(story =>
    <div
      className="blue storybook-center"
      onClick={action("click")}
      style={{ alignItems: "stretch" }}
    >
      <div className="stars" />
      {story()}
    </div>
  )
  // HACK: This is more a story about CSS than HomePage components
  .add("Fixed off-screen subtitle", () =>
    <div id="landing-page">
      <div style={{ padding: "1em", height: 1000 }}>
        (This space left intentionally blank. Scroll down.)
      </div>
      <Visibility className="landing-experiments">
        <div className="more-button">
          <a href="#experiments">More Experiments</a>
        </div>
        <Banner background={true}>
          <a name="experiments"></a>
          <LayoutWrapper flexModifier="column-center">
            <h2 className="banner__subtitle centered">
              Or try our other experiments
            </h2>
            <ExperimentCardList {...cardListProps} />
          </LayoutWrapper>
        </Banner>
      </Visibility>
    </div>
  );

