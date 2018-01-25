import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import UpgradeWarningPage from "./index";
import LayoutWrapper from "../../components/LayoutWrapper";

const baseProps = {
  sendToGA: action("sendToGA"),
  isDevHost: false,
  isProdHost: true,
  protocol: "https:",
  isMinFirefox: true
};

storiesOf("UpgradeWarning", module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="blue" style={{ padding: "10px" }} onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("default", () => <UpgradeWarningPage {...baseProps} />)
  .add("below minimum firefox", () => <UpgradeWarningPage {...baseProps} isMinFirefox={false} />)
  .add("wrong protocol (http)", () => <UpgradeWarningPage {...baseProps} protocol={"http:"} />)
  .add("developing test pilot", () => <UpgradeWarningPage {...baseProps} isDevHost={true} />)
  .add("unapproved hostname", () => <UpgradeWarningPage {...baseProps} isProdHost={false} />);
