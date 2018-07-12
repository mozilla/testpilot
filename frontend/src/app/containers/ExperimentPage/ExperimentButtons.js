import React from "react";
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";

import type {
  FeedbackButtonType,
  MobileTriggerButtonType,
  GraduatedButtonType,
  UninstallButtonType,
  InstallTestPilotButtonType,
  EnableExperimentButtonType,
  MobileStoreButtonType,
  WebExperimentButtonType
} from "./types";

// Import all the icon images as webpack dependencies
import iconFeedbackDark from "../../../images/feedback.svg";
import iconFeedbackWhite from "../../../images/feedback-white.svg";
import iconExperimentTypeAddonDark from "../../../images/experiment-type-addon.svg";
import iconExperimentTypeAddonWhite from "../../../images/experiment-type-addon-white.svg";
import iconExperimentTypeWebDark from "../../../images/experiment-type-web.svg";
import iconExperimentTypeWebWhite from "../../../images/experiment-type-web-white.svg";
import iconExperimentTypeMobileWhite from "../../../images/experiment-type-mobile-white.svg";
import iconIos from "../../../images/ios-light.svg";
import iconGoogle from "../../../images/google-play.png";

export const FeedbackButton = ({
  title,
  slug,
  surveyURL,
  pre_feedback_copy,
  sendToGA,
  doShowPreFeedbackDialog,
  color = "secondary"
}: FeedbackButtonType) => {
  const handleFeedback = evt => {
    if (pre_feedback_copy === null || !pre_feedback_copy) {
      sendToGA("event", {
        eventCategory: "ExperimentDetailsPage Interactions",
        eventAction: "Give Feedback",
        eventLabel: title,
        dimension11: slug
      });
    } else {
      doShowPreFeedbackDialog(evt);
      sendToGA("event", {
        eventCategory: "ExperimentDetailsPage Interactions",
        eventAction: "Give Feedback",
        eventLabel: title,
        dimension11: slug
      });
    }
  };

  return (
    <a
      key="feedback-button"
      id="feedback-button"
      onClick={handleFeedback}
      className={classnames("button icon-button", color)}
      href={surveyURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={color === "default" ? iconFeedbackWhite : iconFeedbackDark}
      />
      <Localized id="giveFeedback">
        <span className="default-text">Give Feedback</span>
      </Localized>
    </a>
  );
};

export const MobileTriggerButton = ({
  doShowMobileAppDialog, optionalClass, color = "default"
}: MobileTriggerButtonType) => {
  return (
    <a
      className={`button mobile-trigger ${color} icon-button ${optionalClass}`}
      onClick={doShowMobileAppDialog}
    >
      <img src={iconExperimentTypeMobileWhite} />
      <Localized id="mobileDialogTitle">
        <span>Get the App</span>
      </Localized>
    </a>
  );
};

export const GraduatedButton = ({
  doShowEolDialog,
  isDisabling,
  title
}: GraduatedButtonType) => {
  return (
    <button
      key="graduated-button"
      onClick={doShowEolDialog}
      id="uninstall-button"
      className={classnames(["button", "warning", "icon-button"], {
        "state-change": isDisabling
      })}
    >
      <span className="state-change-inner" />
      <img src={iconExperimentTypeAddonWhite} />
      <Localized id="disableExperimentTransition">
        <span className="transition-text">Disabling...</span>
      </Localized>
      <Localized id="disableExperiment" $title={title}>
        <span className="default-text">Disable {title}</span>
      </Localized>
    </button>
  );
};

export const UninstallButton = ({
  uninstallExperimentWithSurvey,
  isDisabling,
  title
}: UninstallButtonType) => {
  return (
    <button
      key="uninstall-button"
      onClick={uninstallExperimentWithSurvey}
      id="uninstall-button"
      className={classnames(["button", "secondary", "icon-button"], {
        "state-change": isDisabling
      })}
    >
      <span className="state-change-inner" />
      <img src={iconExperimentTypeAddonDark} />
      <Localized id="disableExperimentTransition">
        <span className="transition-text">Disabling...</span>
      </Localized>
      <Localized id="disableExperiment" $title={title}>
        <span className="default-text">Disable {title}</span>
      </Localized>
    </button>
  );
};

export const InstallTestPilotButton = ({
  installExperiment,
  isEnabling,
  title
}: InstallTestPilotButtonType) => {
  return (
    <button
      key="one-click-button"
      id="one-click-button"
      onClick={installExperiment}
      className={classnames(["button", "primary", "icon-button"], {
        "state-change": isEnabling
      })}
    >
      <div className="state-change-inner" />
      <img src={iconExperimentTypeAddonWhite} />
      <div className="one-click-cta-text">
        {!isEnabling && (
          <LocalizedHtml id="oneClickInstallMinorCta">
            <span className="one-click-minor">Install Test Pilot &amp;</span>
          </LocalizedHtml>
        )}
        {!isEnabling && (
          <Localized id="oneClickInstallMajorCta" $title={title}>
            <span className="one-click-major">Enable {title}</span>
          </Localized>
        )}
      </div>
      {isEnabling && (
        <Localized id="landingInstallingButton">
          <span className="progress-btn-msg">Installing...</span>
        </Localized>
      )}
    </button>
  );
};

export const EnableExperimentButton = ({
  installExperiment,
  isEnabling,
  title,
  color
}: EnableExperimentButtonType) => (
  <button
    key="install-button"
    onClick={installExperiment}
    id="install-button"
    className={classnames(["button", "icon-button", color], {
      "state-change": isEnabling
    })}
  >
    <span className="state-change-inner" />
    <img
      src={
        color === "default"
          ? iconExperimentTypeAddonWhite
          : iconExperimentTypeAddonDark
      }
    />
    <Localized id="enableExperimentTransition">
      <span className="transition-text">Enabling...</span>
    </Localized>
    <Localized id="enableExperiment" $title={title}>
      <span className="default-text">Enable {title}</span>
    </Localized>
  </button>
);

export const MobileStoreButton = ({ url, platform, slug, category, sendToGA }: MobileStoreButtonType) => {
  function handleClick() {
    sendToGA("event", {
      eventCategory: category,
      eventAction: "mobile store click",
      eventLabel: `${platform}`,
      dimension11: slug,
      dimension13: category === "Featured Experiment" ? "Featured Experiment" : "Experiment Detail"
    });
  }
  return (<a
    key={url}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="button mobile"
    onClick={handleClick}
  >
    <img src={platform === "ios" ? iconIos : iconGoogle} />
  </a>
  );
};

export const WebExperimentButton = ({
  color,
  sendToGA,
  slug,
  title,
  web_url
}: WebExperimentButtonType) => {
  function handleGoToLink() {
    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "Go to Web Experiment",
      eventLabel: title,
      dimension11: slug
    });
  }
  return (
    <a
      href={web_url}
      onClick={handleGoToLink}
      target="_blank"
      rel="noopener noreferrer"
      className={classnames("button icon-button", color)}
    >
      <img
        src={
          color === "default"
            ? iconExperimentTypeWebWhite
            : iconExperimentTypeWebDark
        }
      />
      <Localized id="experimentGoToLink" $title={title}>
        <span className="default-text">Go to {title}</span>
      </Localized>
    </a>
  );
};
