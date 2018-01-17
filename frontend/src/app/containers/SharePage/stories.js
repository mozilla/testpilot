import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ShareDialog } from "./index";
import LayoutWrapper from "../../components/LayoutWrapper";


const props = {
  sendToGA: action("sendToGA")
};

storiesOf("ShareDialog", module)
  .addDecorator(story =>
    <div className="content-wrapper" onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("default", () => <ShareDialog {...props} />);
