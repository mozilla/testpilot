// @flow
import React, { Fragment } from "react";
import { Localized } from "fluent-react/compat";
import { experimentL10nId, isMobile } from "../../lib/utils";
import {
  FeedbackButton,
  MobileTriggerButton,
  GraduatedButton,
  UninstallButton,
  InstallTestPilotButton,
  EnableExperimentButton,
  MobileStoreButton,
  WebExperimentButton
} from "./ExperimentButtons";

import type {
  ExperimentControlsType,
  CreateButtonsType
} from "./types";

export default function ExperimentControls({
  doShowEolDialog,
  doShowMobileAppDialog,
  doShowPreFeedbackDialog,
  enabled,
  experiment,
  flashMeasurementPanel,
  graduated,
  hasAddon,
  installExperiment,
  isDisabling,
  isEnabling,
  isMinFirefox,
  pre_feedback_copy,
  sendToGA,
  surveyURL,
  uninstallExperimentWithSurvey,
  userAgent
}: ExperimentControlsType) {
  const {
    max_release,
    min_release,
    platforms
  } = experiment;

  const validVersion = isValidVersion(userAgent, min_release, max_release);

  const highlightPrivacy = () => {
    document.querySelectorAll(".measurements").forEach(el => {
      if (el.offsetTop) {
        window.scrollTo(0, el.offsetTop);
      }
    });
    flashMeasurementPanel();
  };

  const buttons = createButtons({
    doShowEolDialog,
    doShowMobileAppDialog,
    doShowPreFeedbackDialog,
    enabled,
    experiment,
    graduated,
    hasAddon,
    installExperiment,
    isDisabling,
    isEnabling,
    isMinFirefox,
    platforms,
    pre_feedback_copy,
    sendToGA,
    surveyURL,
    uninstallExperimentWithSurvey,
    userAgent,
    validVersion
  });

  const controls = <div className="experiment-controls">{buttons}</div>;

  const showLegal = !graduated;
  let legalSection = null;
  if (showLegal) {
    if (isMinFirefox && !hasAddon && !enabled && platforms.includes("addon")) {
      legalSection = (
        <div className="privacy-link">
          <Localized
            id={experimentL10nId(experiment, "legal-notice")}
            terms-link={<a href="/terms" />}
            privacy-link={<a href="/privacy" />}
            modal-link={<a onClick={highlightPrivacy} />}
          >
            <p className="legal-section">
              By proceeding, you agree to the <terms-link>terms</terms-link> and{" "}
              <privacy-link>privacy</privacy-link> policies of Test Pilot and{" "}
              <modal-link>this experiment&apos;s privacy policy</modal-link>.
            </p>
          </Localized>
        </div>
      );
    } else {
      legalSection = ( buttons !== null &&
        <div className="privacy-link">
          <Localized id="highlightPrivacy">
            <a onClick={highlightPrivacy} className="highlight-privacy">
              Your privacy
            </a>
          </Localized>
        </div>
      );
    }
  }

  return (
    <div className="details-controls">
      {controls}
      {legalSection}
    </div>
  );
}

function maxVersionCheck(userAgent: string, max: number) {
  const version = parseInt(userAgent.split("/").pop(), 10);
  return typeof max === "undefined" || version <= max;
}

function minVersionCheck(userAgent: string, min: number) {
  const version = parseInt(userAgent.split("/").pop(), 10);
  return typeof min === "undefined" || version >= min;
}

function isValidVersion(userAgent: string, min: number, max: number) {
  if (!max) max = Infinity;
  return minVersionCheck(userAgent, min) && maxVersionCheck(userAgent, max);
}

function createButtons({
  doShowEolDialog,
  doShowMobileAppDialog,
  doShowPreFeedbackDialog,
  enabled,
  experiment,
  graduated,
  hasAddon,
  installExperiment,
  isDisabling,
  isEnabling,
  isMinFirefox,
  sendToGA,
  surveyURL,
  uninstallExperimentWithSurvey,
  userAgent,
  validVersion
}: CreateButtonsType) {
  const { slug, title, web_url, ios_url, android_url, platforms, pre_feedback_copy } = experiment;

  const formatGenerator = (platforms) => {
    const type = [];
    if (platforms.includes("addon")) type.push("Addon");
    if (platforms.includes("web")) type.push("Web");
    if (platforms.includes("ios") || platforms.includes("android")) type.push("Mobile");
    return type.join("");
  };

  const controlsFormat = formatGenerator(platforms);

  const mobileControls = () => {
    if (!isMobile(userAgent)) {
      return <MobileTriggerButton {...{ doShowMobileAppDialog, color: "default" }} />;
    }
    const category = "ExperimentDetailsPage Interactions";
    return (
      <Fragment>
        {platforms.includes("ios") && <MobileStoreButton {...{ url: ios_url, platform: "ios", category, sendToGA, slug }} />}
        {platforms.includes("android") && <MobileStoreButton {...{ url: android_url, platform: "android", category, sendToGA, slug }} />}
      </Fragment>
    );
  };


  const webControls = (color) => <WebExperimentButton
    {...{
      web_url,
      title,
      slug,
      sendToGA,
      platforms,
      validVersion,
      color
    }}
  />;

  const addonControls = (color) => {
    if (graduated && enabled) {
      return <GraduatedButton {...{ doShowEolDialog, isDisabling, title }} />;
    }

    if (enabled) {
      return (
        <Fragment>
          <FeedbackButton
            {...{
              title,
              slug,
              surveyURL,
              pre_feedback_copy,
              sendToGA,
              doShowPreFeedbackDialog,
              color
            }}
          />
          <UninstallButton
            {...{ uninstallExperimentWithSurvey, isDisabling, title }}
          />
        </Fragment>
      );
    }

    if (!isMinFirefox || !validVersion || graduated || isMobile(userAgent)) {
      return null;
    }

    if (!hasAddon) {
      return (
        <InstallTestPilotButton {...{ installExperiment, isEnabling, title }} />
      );
    }

    return (
      <EnableExperimentButton {...{ installExperiment, isEnabling, title, color }} />
    );
  };

  switch (controlsFormat) {
    case "Addon":
      return addonControls("default");
    case "Web":
      return webControls("default");
    case "Mobile":
      return mobileControls();
    case "WebMobile":
      return (
        <Fragment>
          {mobileControls()}
          {webControls("secondary")}
        </Fragment>
      );
    case "AddonWeb":
      return (
        <Fragment>
          {addonControls("default")}
          {webControls("secondary")}
        </Fragment>
      );
    case "AddonMobile":
      return (
        <Fragment>
          {mobileControls()}
          {addonControls("secondary")}
        </Fragment>
      );
    case "AddonWebMobile":
      return (
        <Fragment>
          {mobileControls()}
          {addonControls("secondary")}
          {webControls("secondary")}
        </Fragment>
      );
    default:
      return null;
  }
}
