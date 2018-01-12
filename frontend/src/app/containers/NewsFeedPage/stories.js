import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import NewsFeedPage from "./index";
import LayoutWrapper from "../../components/LayoutWrapper";

const baseProps = {
  sendToGA: action("sendToGA"),
  staleNewsUpdates: [],
  freshNewsUpdates: [],
  experiments: []
};

storiesOf("NewsFeedPage", module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="blue" style={{ padding: "10px" }} onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("default", () => <NewsFeedPage {...baseProps} />);
