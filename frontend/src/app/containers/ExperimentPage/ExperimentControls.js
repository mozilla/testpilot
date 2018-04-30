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

  let controls = <div></div>;

  if (enabled) {
    if (graduated) {
      controls = (
        <div className="experiment-controls">
          <button
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
        </div>
      );
    } else {
      controls = (
        <div className="experiment-controls">
          <button
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
          <a
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
        </div>
      );
    }
  } else if (validVersion) {
    const button = <EnableButton
      {...{
        hasAddon,
        experiment,
        installExperiment,
        isEnabling,
        sendToGA
      }}/>;
    if (button) {
      controls = <div className="experiment-controls">{button}</div>;
    }
  }

  let legalSection = <div className="privacy-link">
    <Localized id="highlightPrivacy">
      <a onClick={highlightPrivacy} className="highlight-privacy">
      Your privacy
      </a>
    </Localized>
  </div>;

  if (!hasAddon) {
    legalSection = <div className="privacy-link"><LocalizedHtml id={experimentL10nId(experiment, "legal-notice")}
      $title={title}>
      <p className="legal-section">
        By proceeding, you agree to the <a href="/terms"></a> and <a href="/privacy"></a> policies of Test Pilot and the <a onClick={highlightPrivacy}></a>.
      </p>
    </LocalizedHtml></div>;
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

export const EnableButton = ({
  hasAddon,
  experiment,
  installExperiment,
  isEnabling,
  sendToGA
}: EnableButtonType) => {
  const { platforms, slug, title, web_url } = experiment;
  const useWebLink = (platforms || []).indexOf("web") !== -1;
  if (useWebLink) {
    return <WebExperimentControls {...{ web_url, title, slug, sendToGA }} />;
  }

  if (!hasAddon) {
    return (
      <button
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
};
