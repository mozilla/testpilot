// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Localized } from "fluent-react/compat";
import { buildSurveyURL, experimentL10nId, isMobile } from "../../lib/utils";

import Modal from "../Modal";
import MeasurementSection from "../Measurements";
import MainInstallButton from "../MainInstallButton";
import MobileDialog from "../MobileDialog";
import LayoutWrapper from "../LayoutWrapper";

import {
  MobileStoreButton,
  MobileTriggerButton,
  MobileTriggerIOSButton,
  MobileTriggerAndroidButton
} from "../../containers/ExperimentPage/ExperimentButtons";

import type { InstalledExperiments } from "../../reducers/addon";

type FeaturedButtonProps = {
  clientUUID?: string,
  countryCode: null | string,
  enabled: boolean,
  experiment: Object,
  eventCategory: string,
  fetchCountryCode: Function,
  getWindowLocation: Function,
  hasAddon: any,
  isMobile: boolean,
  enableExperiment: Function,
  installAddon: Function,
  isExperimentEnabled: Function,
  isFirefox: boolean,
  isMinFirefox: boolean,
  installed: InstalledExperiments,
  sendToGA: Function,
  userAgent: string
}

type FeaturedButtonState = {
  isIOSDialog: boolean,
  showLegalDialog: boolean,
  showMobileDialog: boolean
}

export default class FeaturedButton extends Component<FeaturedButtonProps, FeaturedButtonState> {
  constructor(props: FeaturedButtonProps) {
    super(props);
    this.state = {
      isIOSDialog: false,
      showLegalDialog: false,
      showMobileDialog: false
    };
  }

  l10nId = (pieces: string) => {
    return experimentL10nId(this.props.experiment, pieces);
  };

  sendMetric = (ev: Object, args: Object) => {
    const { sendToGA, eventCategory, hasAddon, installed,
      experiment } = this.props;
    sendToGA("event", Object.assign({
      eventCategory,
      eventAction: "link click",
      dimension1: hasAddon,
      dimension2: Object.keys(installed).length > 0,
      dimension3: Object.keys(installed).length,
      dimension11: experiment.slug,
      dimension13: "Featured Experiment"
    }, args), ev);
  };

  renderLegalLink() {
    const { title } = this.props.experiment;
    const launchLegalModal = (ev) => {
      ev.preventDefault();
      this.setState({ showLegalDialog: true });
      this.sendMetric(ev, {eventLabel: "Popup Featured privacy"});
    };

    return (<Localized id={this.l10nId("legal_notice")}
      $title={title}
      terms-link={<a href="/terms" onClick={(ev) => this.sendMetric(ev, {eventLabel: "Open general terms"})}></a>}
      privacy-link={<a href="/privacy" onClick={(ev) => this.sendMetric(ev, {eventLabel: "Open general privacy"})}></a>}
      modal-link={<a href="#" onClick={launchLegalModal}></a>}>
      <p className="main-install__legal">
        By proceeding, you agree to the <terms-link>terms</terms-link>{" "}
        and <privacy-link>privacy</privacy-link> policies of Test Pilot and{" "}
        <modal-link>this experiment&apos;s privacy policy</modal-link>.
      </p>
    </Localized>);
  }

  renderLegalModal() {
    const { showLegalDialog } = this.state;
    const { experiment } = this.props;

    if (!showLegalDialog) {
      return null;
    }

    return (
      <Modal wrapperClass='legal-modal'
        onCancel={() => this.setState({ showLegalDialog: false })}
        onComplete={() => this.setState({ showLegalDialog: false })}>
        <MeasurementSection experiment={experiment}
          l10nId={this.l10nId}
          highlightMeasurementPanel={false}></MeasurementSection>
      </Modal>);
  }

  handleManage = (evt: Function) => {
    const { enabled, experiment } = this.props;
    const { title, slug } = experiment;
    this.sendMetric(evt, {
      eventAction: "button click",
      eventLabel: "Manage Featured Button",
      dimension4: enabled,
      dimension5: title,
      dimension11: slug
    });
  };

  handleFeedback = (evt: Function) => {
    const { enabled, experiment } = this.props;
    const { title, slug } = experiment;
    this.sendMetric(evt, {
      eventAction: "button click",
      eventLabel: "Feedback Featured Button",
      dimension4: enabled,
      dimension5: title,
      dimension11: slug
    });
  }

  doShowMobileAppDialog = (evt: MouseEvent, platform: string) => {
    evt.preventDefault();
    const { experiment }  = this.props;

    this.setState({
      showMobileDialog: true,
      isIOSDialog: (platform === "ios")
    });
    this.props.sendToGA("event", {
      eventCategory: "Featured Experiment",
      eventAction: "mobile send click",
      eventLabel: experiment.title,
      dimension11: experiment.slug
    });
  };

  render() {
    const { experiment, installed, clientUUID,
      hasAddon, enabled, userAgent, sendToGA } = this.props;
    const { slug, survey_url, title, platforms, ios_url, android_url } = experiment;

    const { showMobileDialog, isIOSDialog } = this.state;

    const category = "Featured Experiment";

    const mobileControls = () => {
      if (!isMobile(userAgent)) {
        if (platforms.includes("ios") && platforms.includes("android")) {
          return (
            <React.Fragment>
              <div className="main-install__spacer"></div>
              <div className="mobile-button-wrap">
                <MobileTriggerIOSButton doShowMobileAppDialog={this.doShowMobileAppDialog} color={"primary"} />
                <MobileTriggerAndroidButton doShowMobileAppDialog={this.doShowMobileAppDialog} color={"primary"} />
              </div>
              { this.renderLegalLink() }
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <div className="main-install__spacer"></div>
            <MobileTriggerButton optionalClass={"main-install__button"} doShowMobileAppDialog={this.doShowMobileAppDialog} color={"primary"} platforms={platforms} />
            { this.renderLegalLink() }
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          {platforms.includes("ios") && <MobileStoreButton {...{ url: ios_url, platform: "ios", slug, category, sendToGA }} />}
          {platforms.includes("android") && <MobileStoreButton {...{ url: android_url, platform: "android", slug, category, sendToGA }} />}
        </React.Fragment>
      );
    };

    let Buttons;

    if (platforms.includes("ios") || platforms.includes("android")) {
      Buttons = (
        <div>
          {showMobileDialog &&
           <MobileDialog {...this.props} fromFeatured={true} isIOS={isIOSDialog}
             onCancel={() => this.setState({ showMobileDialog: false })}
           />}
          <LayoutWrapper flexModifier={"column-center-start-breaking"}
            helperClass="main-install">
            { mobileControls() }
          </LayoutWrapper>
          { this.renderLegalModal() }
        </div>
      );
    } else if (enabled && hasAddon) {
      const surveyURL = buildSurveyURL("givefeedback", title, installed, clientUUID, survey_url);
      Buttons = (
        <div>
          <div className="featured-experiment__enabled-buttons">
            <Localized id="experimentCardManage">
              <Link onClick={this.handleManage}
                to={`/experiments/${slug}`}
                className="button secondary manage-button">
                Manage
              </Link>
            </Localized>
            <Localized id="experimentCardFeedback">
              <a onClick={this.handleFeedback}
                href={surveyURL} target="_blank" rel="noopener noreferrer"
                className="button default featured-feedback">
                Feedback
              </a>
            </Localized>
          </div>
        </div>
      );
    } else {
      Buttons = (
        <div>
          <MainInstallButton {...this.props}
            isFeatured={true}
            experimentTitle={title}
            experiment={experiment}
            experimentLegalLink={this.renderLegalLink()}
            eventCategory="HomePage Interactions"
            eventLabel="Install the Add-on" />
          { this.renderLegalModal() }
        </div>);
    }

    return Buttons;
  }

}
