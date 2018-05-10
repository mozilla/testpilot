import React from "react";
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";
import { experimentL10nId } from "../../lib/utils";

import type {
  ExperimentControlsType,
  WebExperimentControlsType,
  EnableButtonType
} from "./types";

export default function ExperimentControls({
  isMinFirefox,
  hasAddon,
  userAgent,
  experiment,
  installed,
  graduated,
  enabled,
  installExperiment,
  uninstallExperimentWithSurvey,
  isEnabling,
  isDisabling,
  doShowEolDialog,
  doShowPreFeedbackDialog,
  flashMeasurementPanel,
  sendToGA,
  surveyURL
}: ExperimentControlsType) {
  const {
    title,
    min_release,
    max_release,
    platforms,
    pre_feedback_copy,
    slug
  } = experiment;

  const validVersion = isValidVersion(userAgent, min_release, max_release);

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
        eventLabel: experiment.title,
        dimension11: slug
      });
    }
  };

  const highlightPrivacy = () => {
    document.querySelectorAll(".measurements").forEach(
      el => {
        if (el.offsetTop) {
          window.scrollTo(0, el.offsetTop);
        }
      });
    flashMeasurementPanel();
  };

  const buttons = platforms.map(platform => createButton({
    doShowEolDialog,
    enabled,
    experiment,
    graduated,
    hasAddon,
    installExperiment,
    isDisabling,
    isEnabling,
    isMinFirefox,
    platform,
    sendToGA,
    uninstallExperimentWithSurvey,
    userAgent,
    validVersion
  })).filter(b => b);
  if (enabled) {
    if (!graduated) {
      buttons.unshift(
        <a
          key="feedback-button"
          id="feedback-button"
          onClick={handleFeedback}
          className="button default"
          href={surveyURL}
          target="_blank"
          rel="noopener noreferrer">
          <Localized id="giveFeedback">
            <span className="default-text">Give Feedback</span>
          </Localized>
        </a>
      );
    }
    if (!hasAddon) {
      buttons.unshift(
        <button
          key="txp-button"
          id="one-click-button"
          onClick={installExperiment}
          className={classnames(["button", "primary"], {
            "state-change": isEnabling
          })}
        >
          <div className="state-change-inner" />
          {!isEnabling && <Localized id="landingInstallButton">
            <span className="default-btn-msg">
              Install the Test Pilot Add-on
            </span>
          </Localized>}
          {isEnabling &&
          <Localized id="landingInstallingButton">
            <span className="progress-btn-msg">Installing...</span>
          </Localized>}
        </button>
      );
    }
  }
  const controls = <div className="experiment-controls">{buttons}</div>;

  const showLegal = buttons.length > 0 && !graduated;
  let legalSection = null;
  if (showLegal) {
    if (isMinFirefox && !hasAddon && !enabled && platforms.includes("addon")) {
      legalSection = <div className="privacy-link">
        <LocalizedHtml id={experimentL10nId(experiment, "legal-notice")} $title={title}>
          <p className="legal-section">
            By proceeding, you agree to the <a href="/terms"></a> and <a href="/privacy"></a> policies of Test Pilot and the <a onClick={highlightPrivacy}></a>.
          </p>
        </LocalizedHtml>
      </div>;
    } else {
      legalSection = <div className="privacy-link">
        <Localized id="highlightPrivacy">
          <a onClick={highlightPrivacy} className="highlight-privacy">
          Your privacy
          </a>
        </Localized>
      </div>;
    }
  }

  return (
    <div className="details-controls">
      { controls }
      { legalSection }
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

export const WebExperimentControls = ({
  web_url,
  title,
  slug,
  sendToGA
}: WebExperimentControlsType) => {
  function handleGoToLink() {
    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "Enable Experiment",
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
      className="button default"
    >
      <Localized id="experimentGoToLink" $title={title}>
        <span className="default-text">
          Go to {title}
        </span>
      </Localized>
    </a>
  );
};

function createButton({
  doShowEolDialog,
  enabled,
  experiment,
  graduated,
  hasAddon,
  installExperiment,
  isDisabling,
  isEnabling,
  isMinFirefox,
  platform,
  sendToGA,
  uninstallExperimentWithSurvey,
  userAgent,
  validVersion
}: EnableButtonType) {
  const { slug, title, web_url, ios_url, android_url } = experiment;
  if (platform === "web") {
    return <WebExperimentControls {...{ key: web_url, web_url, title, slug, sendToGA }} />;
  } else if (platform === "addon") {
    if (graduated && enabled) {
      return (
        <button
          key="graduated-button"
          onClick={doShowEolDialog}
          id="uninstall-button"
          className={classnames(["button", "warning"], {
            "state-change": isDisabling
          })}
        >
          <span className="state-change-inner" />
          <Localized id="disableExperimentTransition">
            <span className="transition-text">Disabling...</span>
          </Localized>
          <Localized id="disableExperiment" $title={title}>
            <span className="default-text">
              Disable {title}
            </span>
          </Localized>
        </button>
      );
    }

    if (enabled) {
      return (
        <button
          key="uninstall-button"
          onClick={uninstallExperimentWithSurvey}
          id="uninstall-button"
          className={classnames(["button", "secondary"], {
            "state-change": isDisabling
          })}
        >
          <span className="state-change-inner" />
          <Localized id="disableExperimentTransition">
            <span className="transition-text">Disabling...</span>
          </Localized>
          <Localized id="disableExperiment" $title={title}>
            <span className="default-text">
              Disable {title}
            </span>
          </Localized>
        </button>
      );
    }

    if (!isMinFirefox || !validVersion) {
      return null;
    }

    if (!hasAddon) {
      return (
        <button
          key="one-click-button"
          id="one-click-button"
          onClick={installExperiment}
          className={classnames(["button", "primary"], {
            "state-change": isEnabling
          })}
        >
          <div className="state-change-inner" />
          <LocalizedHtml id="oneClickInstallMinorCta">
            <span className="one-click-minor">Install Test Pilot &amp;</span>
          </LocalizedHtml>
          <Localized id="oneClickInstallMajorCta" $title={title}>
            <span className="one-click-major">Enable {title}</span>
          </Localized>
        </button>
      );
    }

    return (
      <button
        key="install-button"
        onClick={installExperiment}
        id="install-button"
        className={classnames(["button", "default"], {
          "state-change": isEnabling
        })}
      >
        <span className="state-change-inner" />
        <Localized id="enableExperimentTransition">
          <span className="transition-text">Enabling...</span>
        </Localized>
        <Localized id="enableExperiment" $title={title}>
          <span className="default-text">
            Enable {title}
          </span>
        </Localized>
      </button>
    );
  } else if (platform === "ios") {
    return <a
      key={ios_url}
      href={ios_url}
      target="_blank"
      rel="noopener noreferrer"
      className="button mobile"
    >
      <img height="80px" src="/static/images/ios.svg" />
    </a>;
  } else if (platform === "android") {
    return <a
      key={android_url}
      href={android_url}
      target="_blank"
      rel="noopener noreferrer"
      className="button mobile">
      <img height="80px" src="/static/images/google-play.png" />
    </a>;
  }
  return null;
}
