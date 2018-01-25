import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Header from "./index";

storiesOf("Header", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      {story()}
      <div style={{ flex: 1 }} />
    </div>
  )
  .add("without addon", () =>
    <Header />
  )
  .add("with addon", () =>
    <Header hasAddon="true" />
  );
