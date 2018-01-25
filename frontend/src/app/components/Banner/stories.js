import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Banner from "./index";
import LayoutWrapper from "../LayoutWrapper";
import Copter from "../Copter";
import MainInstallButton from "../MainInstallButton";


storiesOf("Banner", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")} style={{ alignItems: "stretch" }}>
      <div className="stars" />
      {story()}
    </div>
  )
  .add("Big Banner", () =>
    <Banner>
      <LayoutWrapper flexModifier="row-center-breaking">
        <Copter small="true" animation="fly-up"/>
        <div className="banner__spacer" />
        <div>
          <h2 className="banner__title">Test new features.</h2>
          <h2 className="banner__title">Give your feedback.</h2>
          <h2 className="banner__title">Help build Firefox.</h2>
        </div>
      </LayoutWrapper>

      <MainInstallButton />
    </Banner>
  )
  .add("Condensed Banner", () =>
    <Banner condensed={true}>
      <LayoutWrapper flexModifier="row-between-reverse">
        <h2 className="banner__title">
          Welcome to Test Pilot!
        </h2>
        <Copter small={true} />
      </LayoutWrapper>
    </Banner>
  );

