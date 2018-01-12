import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";

import NewsletterForm from "./index";
import LayoutWrapper from "../LayoutWrapper";

const baseProps = {
  email: "",
  privacy: false,
  isModal: false,
  subscribe: () => null,
  setEmail: () => null,
  setPrivacy: () => null
};

storiesOf("NewsletterForm", module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="blue" style={{ padding: 10 }}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("base state with knobs", () =>
    <NewsletterForm
      {...baseProps}
      email={text("Email", "")}
      privacy={boolean("Privacy", false)}
      isModal={boolean("Is Modal", false)}
    />)
  .add("with email but no agreement", () =>
    <NewsletterForm
      {...baseProps}
      email={"foo@example.com"}
    />)
  .add("modal, filled in", () =>
    <NewsletterForm
      {...baseProps}
      email={"foo@example.com"}
      privacy={true}
      isModal={true}
    />)
  .add("submitting", () =>
    <NewsletterForm
      {...baseProps}
      email={"foo@example.com"}
      privacy={true}
      isModal={true}
      submitting={true}
    />);

