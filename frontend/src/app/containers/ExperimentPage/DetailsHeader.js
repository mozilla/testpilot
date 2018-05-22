// @flow

import React from "react";
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import LayoutWrapper from "../../components/LayoutWrapper";
import ExperimentPlatforms from "../../components/ExperimentPlatforms";
import { experimentL10nId, isMobile } from "../../lib/utils";

import type {
  DetailsHeaderProps,
  MinimumVersionNoticeType,
  MaximumVersionNoticeType
} from "./types";

export default class DetailsHeader extends React.Component {
  props: DetailsHeaderProps;
  didScroll: boolean;
  scrollListener: Function;

  constructor(props: DetailsHeaderProps) {
    super(props);
  }

  render() {
    const { l10nId } = this;

    const {
      sendToGA,
      userAgent,
      hasAddon,
      enabled,
      installed,
      graduated,
      experiment
    } = this.props;

    const { slug, thumbnail, title, subtitle, error, min_release, max_release,
      platforms } = experiment;

    const isIOS = (/iphone|ipod|ipad/i.test(userAgent));
    const isAndroid = (/android/i.test(userAgent));

    const both = (platforms.includes("ios") && platforms.includes("android"));
    const none = (!platforms.includes("ios") && !platforms.includes("android"));

    let statusType = null;
    if (error) {
      statusType = "error";
    } else if (enabled) {
      statusType = "enabled";
      // mobile and only 1 mobile platform is available
    } else if (isMobile(userAgent) && !both && !none) {
      // is ios & ios not available
      if (isIOS && !platforms.includes("ios")) {
        statusType = "wrongPlatformAndroid";
      // is android & android not available
      } else if (isAndroid && !platforms.includes("android")) {
        statusType = "wrongPlatformIOS";
      }
    }

    const hasStatus =
      !!statusType &&
      !(
        installed[experiment.addon_id] &&
        installed[experiment.addon_id].manuallyDisabled
      );

    return (
      <div
        key="details-header-wrapper"
        className={classnames("details-header-wrapper", {
          "has-status": hasStatus
        })}
      >
        <div className={classnames("status-bar", statusType)}>
          {statusType === "enabled" &&
              <Localized id="isEnabledStatusMessage" $title={title}>
                <span>
                  {title} is enabled.
                </span>
              </Localized>}
          {statusType === "error" &&
              <Localized id="installErrorMessage" $title={title}>
                <span>
                  Uh oh. {title} could not be enabled. Try again later.
                </span>
              </Localized>}
          {statusType === "wrongPlatformIOS" &&
              <Localized id="wrongPlatformIOS">
                <span>
                  This experiment is available for iOS devices only.
                </span>
              </Localized>}
          {statusType === "wrongPlatformAndroid" &&
              <Localized id="wrongPlatformAndroid">
                <span>
                  This experiment is available for Android devices only.
                </span>
              </Localized>}
        </div>
        <LayoutWrapper
          helperClass="details-header"
          flexModifier="row-between-breaking"
        >
          <div className={`experiment-icon-wrapper-${slug} experiment-icon-wrapper`}>
            <div className="experiment-icon" style={{backgroundImage: `url(${thumbnail})`}} />
          </div>
          <header>
            <h1>
              {title}
            </h1>
            {subtitle &&
                <Localized id={l10nId("subtitle")}>
                  <h4 className="subtitle">
                    {subtitle}
                  </h4>
                </Localized>}
          </header>
          <div className="spacer"></div>
          {experiment.platforms &&
                  <ExperimentPlatforms experiment={experiment} />}
          <MinimumVersionNotice
            {...{ userAgent, slug, title, hasAddon, min_release, sendToGA }}
          />
          <MaximumVersionNotice
            {...{
              userAgent,
              title,
              slug,
              hasAddon,
              max_release,
              graduated,
              sendToGA
            }}
          />
        </LayoutWrapper>
      </div>
    );
  }

  l10nId = (pieces: string) => experimentL10nId(this.props.experiment, pieces);
}

function maxVersionCheck(userAgent: string, max: number) {
  const version = parseInt(userAgent.split("/").pop(), 10);
  return typeof max === "undefined" || version <= max;
}

function minVersionCheck(userAgent: string, min: number) {
  const version = parseInt(userAgent.split("/").pop(), 10);
  return typeof min === "undefined" || version >= min;
}

export const MinimumVersionNotice = ({
  userAgent,
  title,
  slug,
  hasAddon,
  min_release,
  sendToGA
}: MinimumVersionNoticeType) => {
  if (hasAddon && !minVersionCheck(userAgent, min_release)) {
    return (
      <div className="upgrade-notice">
        <Localized
          id="upgradeNoticeTitle"
          $title={title}
          $min_release={min_release}
        >
          <div>
            {title} requires Firefox {min_release} or later.
          </div>
        </Localized>
        <Localized id="upgradeNoticeLink">
          <a
            onClick={() =>
              sendToGA("event", {
                eventCategory: "ExperimentDetailsPage Interactions",
                eventAction: "Upgrade Notice",
                eventLabel: title,
                dimension11: slug
              })}
            href="https://support.mozilla.org/kb/find-what-version-firefox-you-are-using"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to update Firefox.
          </a>
        </Localized>
      </div>
    );
  }
  return null;
};

export const MaximumVersionNotice = ({
  userAgent,
  title,
  slug,
  hasAddon,
  max_release,
  graduated,
  sendToGA
}: MaximumVersionNoticeType) => {
  if (hasAddon && !maxVersionCheck(userAgent, max_release) && !graduated) {
    return (
      <div className="upgrade-notice">
        <Localized id="versionChangeNotice" $experiment_title={title}>
          <div>
            {title} is not supported in this version of Firefox.
          </div>
        </Localized>
        <Localized id="versionChangeNoticeLink">
          <a
            onClick={() =>
              sendToGA("event", {
                eventCategory: "ExperimentDetailsPage Interactions",
                eventAction: "Upgrade Notice",
                eventLabel: title,
                dimension11: slug
              })}
            href="https://www.mozilla.org/firefox/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get the current version of Firefox.
          </a>
        </Localized>
      </div>
    );
  }
  return null;
};
