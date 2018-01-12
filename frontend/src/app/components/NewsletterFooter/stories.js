import React from "react";

import { storiesOf } from "@storybook/react";

import NewsletterFooter from "./index";
import LayoutWrapper from "../LayoutWrapper";

const baseProps = {
  getWindowLocation: () => "https://example.com",
  sendToGA: () => null,
  newsletterForm: {
    failed: false,
    succeeded: false
  }
};

storiesOf("NewsletterFooter", module)
  .addDecorator(story =>
    <div className="blue" style={{ padding: 10 }}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add("base state", () =>
    <NewsletterFooter
      {...baseProps}
    />)
  .add("with email", () =>
    <NewsletterFooter
      {...baseProps}
      newsletterForm={{
        email: "foo@example.com"
      }}
    />)
  .add("agreed", () =>
    <NewsletterFooter
      {...baseProps}
      newsletterForm={{
        email: "foo@example.com",
        privacy: true
      }}
    />)
  .add("failed", () =>
    <NewsletterFooter
      {...baseProps}
      newsletterForm={{
        failed: true,
        succeeded: false
      }}
    />)
  .add("succeeded", () =>
    <NewsletterFooter
      {...baseProps}
      newsletterForm={{
        failed: false,
        succeeded: true
      }}
    />);
