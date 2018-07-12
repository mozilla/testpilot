// @flow

import React from "react";
import { Link } from "react-router-dom";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../LocalizedHtml";
import { buildSurveyURL, experimentL10nId, isMobile } from "../../lib/utils";

import Modal from "../Modal";
import MeasurementSection from "../Measurements";
import MainInstallButton from "../MainInstallButton";
import MobileDialog from "../MobileDialog";
import LayoutWrapper from "../LayoutWrapper";

import {
  MobileTriggerButton,
  MobileStoreButton
} from "../../containers/ExperimentPage/ExperimentButtons";

import type { InstalledExperiments } from "../../reducers/addon";

type FeaturedButtonProps = {
  clientUUID?: string,
  enabled: boolean,
  experiment: Object,
  eventCategory: string,
  fetchCountryCode: Function,
  getWindowLocation: Function,
  hasAddon: any,
  installed: InstalledExperiments,
  sendToGA: Function,
  userAgent: string
}

type FeaturedButtonState = {
  showLegalDialog: boolean,
  showMobileDialog: boolean
}

export default class FeaturedButton extends React.Component {
  props: FeaturedButtonProps
  state: FeaturedButtonState

  constructor(props: FeaturedButtonProps) {
    super(props);
    this.state = {
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

    return (<LocalizedHtml id={this.l10nId("legal-notice")}
      $title={title}>
      <p className="main-install__legal">
            By proceeding, you agree to the <a href="/terms" onClick={(ev) => this.sendMetric(ev, {eventLabel: "Open general terms"})}></a>
            and <a href="/privacy" onClick={(ev) => this.sendMetric(ev, {eventLabel: "Open general privacy"})}></a> policies of Test Pilot and the
        <a href="#" onClick={launchLegalModal}></a>.
      </p>
    </LocalizedHtml>);
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

  doShowMobileAppDialog = (evt: MouseEvent) => {
    evt.preventDefault();
    const { experiment }  = this.props;

    this.setState({ showMobileDialog: true });
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

    const { showMobileDialog } = this.state;

    const category = "Featured Experiment";

    const mobileControls = () => {
      if (!isMobile(userAgent)) {
        return (
          <React.Fragment>
            <div className="main-install__spacer"></div>
            <MobileTriggerButton optionalClass={"main-install__button"} doShowMobileAppDialog={this.doShowMobileAppDialog} color={"primary"} />
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
           <MobileDialog {...this.props} fromFeatured={true}
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
