// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import LayoutWrapper from "../LayoutWrapper";
import LocalizedHtml from "../LocalizedHtml";

import "./index.scss";

import config from "../../config";

import type { MainInstallButtonProps } from "../types";

type MainInstallButtonState = { isInstalling: boolean };

export default class MainInstallButton extends React.Component {
  props: MainInstallButtonProps;
  state: MainInstallButtonState;

  constructor(props: MainInstallButtonProps) {
    super(props);
    this.state = {
      isInstalling: false
    };
  }

  install(e: Object) {
    // Don't install if a mouse button other than the primary button was clicked
    if (e.button !== 0) {
      return;
    }

    const { sendToGA, eventCategory, installAddon,
      eventLabel, experiment, experimentTitle, isFeatured,
      installed, hasAddon, enableExperiment } = this.props;

    if (isFeatured) {
      const { slug } = experiment;
      sendToGA("event", {
        eventCategory,
        eventAction: "button click",
        eventLabel: "MainInstall Featured Button",
        dimension1: hasAddon,
        dimension2: installed ? Object.keys(installed).length > 0 : false,
        dimension3: installed ? Object.keys(installed).length : 0,
        dimension4: false, // enabled?
        dimension5: experimentTitle,
        dimension11: slug,
        dimension13: "Featured Experiment"
      });
    }

    this.setState({ isInstalling: true });
    const install = experiment ?
      enableExperiment(experiment, eventCategory, eventLabel) :
      installAddon(sendToGA, eventCategory, eventLabel);

    const after = () => this.setState({ isInstalling: false });
    install.then(after, after);
  }

  render() {
    const { isFirefox, isMinFirefox, isMobile, hasAddon, experimentTitle, experimentLegalLink, experiment } = this.props;
    const isInstalling = this.state.isInstalling || (experiment && experiment.inProgress);

    const terms = <Localized id="landingLegalNoticeTermsOfUse">
      <a href="/terms"/>
    </Localized>;
    const privacy = <Localized id="landingLegalNoticePrivacyNotice">
      <a href="/privacy"/>
    </Localized>;
    const layout = experimentTitle ? "column-center-start-breaking" : "column-center";

    return (
      <LayoutWrapper flexModifier={layout} helperClass="main-install">
        <div className="main-install__spacer" />
        {(isMinFirefox && !isMobile) ? this.renderInstallButton(isInstalling, hasAddon) : this.renderAltButton(isFirefox, isMobile) }
        {isMinFirefox && !isMobile && !experimentLegalLink && <LocalizedHtml id="landingLegalNotice" $terms={terms} $privacy={privacy}>
          <p className="main-install__legal">
          By proceeding, you agree to the {terms} and {privacy} of Test Pilot.
          </p>
        </LocalizedHtml>}

        {isMinFirefox && !isMobile && experimentLegalLink && experimentLegalLink}
      </LayoutWrapper>
    );
  }

  renderEnableExperimentButton(title: string) {
    return (
      <div className="main-install__enable">
        <LocalizedHtml id="oneClickInstallMajorCta" $title={title}>
          <span className="main-install__minor-cta">Enable {title}</span>
        </LocalizedHtml>
      </div>
    );
  }

  renderOneClickInstallButton(title: string) {
    return (
      <div className="main-install__one-click">
        <LocalizedHtml id="oneClickInstallMinorCta">
          <span className="main-install__minor-cta">Install Test Pilot &amp;</span>
        </LocalizedHtml>
        <Localized id="oneClickInstallMajorCta" $title={title}>
          <span className="main-install__major-cta">Enable {title}</span>
        </Localized>
      </div>
    );
  }

  renderInstallButton(isInstalling: boolean, hasAddon: any) {
    const { experimentTitle, isExperimentEnabled, experiment } = this.props;
    let installButton = <Localized id="landingInstallButton">
      <span className="default-btn-msg">
        Install the Test Pilot Add-on
      </span>
    </Localized>;
    const installingButton = (<Localized id="landingInstallingButton">
      <span className="progress-btn-msg">Installing...</span>
    </Localized>);
    const enablingButton = (<Localized id="enableExperimentTransition">
      <span className="progress-btn-msg">Enabling...</span>
    </Localized>);

    if (experimentTitle) {
      const enabled = isExperimentEnabled(experiment);
      if (hasAddon && !enabled) {
        installButton = this.renderEnableExperimentButton(experimentTitle);
      } else if (!hasAddon && !enabled) {
        installButton = this.renderOneClickInstallButton(experimentTitle);
      }
    }

    const isEnabling = (experimentTitle && hasAddon && !isExperimentEnabled(experiment) && isInstalling);
    let btn = isEnabling ? enablingButton : installingButton;
    return <button onClick={e => this.install(e)}
      className={classnames(`button primary main-install__button`, { "state-change": isInstalling })}>
      {!isInstalling && installButton}
      {isInstalling ? btn : null}
      <div className="state-change-inner"></div>
    </button>;
  }

  renderAltButton(isFirefox: boolean, isMobile: boolean) {
    if (isFirefox && isMobile) {
      return (
        <div>
          <Localized id="landingRequiresDesktop">
            <span>Test Pilot requires Firefox for Desktop on Windows, Mac or Linux</span>
          </Localized>
        </div>
      );
    }
    return (
      <div>
        {!isFirefox ? (
          <Localized id="landingDownloadFirefoxDesc">
            <span className="main-install__available">(Test Pilot is available for Firefox on Windows, OS X and Linux)</span>
          </Localized>
        ) : (
          <Localized id="landingUpgradeDesc2" $version={config.minFirefoxVersion}>
            <span className="parens">Test Pilot requires Firefox { config.minFirefoxVersion } or higher.</span>
          </Localized>
        )
        }
        {!isMobile && <a href="https://www.mozilla.org/firefox" className="button primary main-install__download">
          <div className="main-install__icon">
            <div className="main-install__badge"></div>
          </div>
          <div className="main-install__copy">
            {(!isFirefox) ? (
              <Localized id="landingDownloadFirefoxTitle">
                <div className="main-install__title">Firefox</div>
              </Localized>
            ) : (
              <Localized id="landingUpgradeFirefoxTitle">
                <div className="main-install__title">Upgrade Firefox</div>
              </Localized>
            )
            }
            <Localized id="landingDownloadFirefoxSubTitle">
              <div className="main-install__description">Free Download</div>
            </Localized>
          </div>
        </a>}
      </div>
    );
  }
}
