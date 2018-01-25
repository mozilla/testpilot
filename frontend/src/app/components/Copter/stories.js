import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Copter from "./index";
import LayoutWrapper from "../LayoutWrapper";


storiesOf("Copter", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      <LayoutWrapper flexModifier="column-center">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("normal", () =>
    <Copter />
  )
  .add("small", () =>
    <Copter small={ true }
    />
  )
  .add("animated", () =>
    <Copter animation="fade-in-fly-up"/>
  );
