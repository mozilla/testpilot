import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import GraduatedNotice from "./index";
import LayoutWrapper from "../LayoutWrapper";


storiesOf("GraduatedNotice", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      <div className="default-background">
        <section id="experiment-page">
          <div id="details">
            <LayoutWrapper helperClass="details-content" flexModifier="details-content">
              <div className="details-overview">
                <div className="experiment-icon-wrapper-dev-example experiment-icon-wrapper">
                  <img className="experiment-icon" src="/static/images/check.png"></img>
                </div>
              </div>
              <div className="details-description">
                {story()}
              </div>
            </LayoutWrapper>
          </div>
        </section>
      </div>
    </div>
  )
  .add("base state", () =>
    <GraduatedNotice />
  )
  .add("with graduation url", () =>
    <GraduatedNotice
      graduation_url="https://medium.com/firefox-test-pilot"
    />
  );
