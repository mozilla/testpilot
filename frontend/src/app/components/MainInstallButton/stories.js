import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MainInstallButton from "./index";
import LayoutWrapper from "../LayoutWrapper";


const baseProps = {
  isFirefox: true,
  isMinFirefox: true,
  isMobile: false,
  hasAddon: false
};


storiesOf("MainInstallButton", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      { story() }
    </div>
  )
  .add("Valid Firefox, Homepage", () =>
    <LayoutWrapper flexModifier="column-center">
      <MainInstallButton { ...baseProps } />
    </LayoutWrapper>
  )
  .add("Firefox is not up to date", () =>
    <LayoutWrapper flexModifier="column-center">
      <MainInstallButton { ...{ ...baseProps, isMinFirefox: false }} />
    </LayoutWrapper>
  )
  .add("Mobile Browser", () =>
    <LayoutWrapper flexModifier="column-center">
      <MainInstallButton  { ...{ ...baseProps, isMobile: true }} />
    </LayoutWrapper>
  )
  .add("Non-Firefox desktop browser", () =>
    <LayoutWrapper flexModifier="column-center">
      <MainInstallButton { ...{ ...baseProps, isMinFirefox: null, isFirefox: false }} />
    </LayoutWrapper>
  )
  .add("Is installing", () =>
    <LayoutWrapper flexModifier="column-center">
      <MainInstallButton { ...{ ...baseProps, isInstalling: true }} />
    </LayoutWrapper>
  )
  .add("Is An Experiment Page", () =>
    <LayoutWrapper>
      <MainInstallButton { ...{ ...baseProps, experimentTitle: "Pizza" }} />
    </LayoutWrapper>
  );

