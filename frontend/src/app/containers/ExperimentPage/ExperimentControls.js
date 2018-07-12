import React from "react";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";
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
  sendToGA,
  surveyURL,
  uninstallExperimentWithSurvey,
  userAgent
}: ExperimentControlsType) {
  const {
    max_release,
    min_release,
    platforms,
    title
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
          <LocalizedHtml
            id={experimentL10nId(experiment, "legal-notice")}
            $title={title}
          >
            <p className="legal-section">
              By proceeding, you agree to the <a href="/terms" /> and{" "}
              <a href="/privacy" /> policies of Test Pilot and the{" "}
              <a onClick={highlightPrivacy} />.
            </p>
          </LocalizedHtml>
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
      <React.Fragment>
        {platforms.includes("ios") && <MobileStoreButton {...{ url: ios_url, platform: "ios", category, sendToGA, slug }} />}
        {platforms.includes("android") && <MobileStoreButton {...{ url: android_url, platform: "android", category, sendToGA, slug }} />}
      </React.Fragment>
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
        <React.Fragment>
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
        </React.Fragment>
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
        <React.Fragment>
          {mobileControls()}
          {webControls("secondary")}
        </React.Fragment>
      );
    case "AddonWeb":
      return (
        <React.Fragment>
          {addonControls("default")}
          {webControls("secondary")}
        </React.Fragment>
      );
    case "AddonMobile":
      return (
        <React.Fragment>
          {mobileControls()}
          {addonControls("secondary")}
        </React.Fragment>
      );
    case "AddonWebMobile":
      return (
        <React.Fragment>
          {mobileControls()}
          {addonControls("secondary")}
          {webControls("secondary")}
        </React.Fragment>
      );
    default:
      return null;
  }
}
