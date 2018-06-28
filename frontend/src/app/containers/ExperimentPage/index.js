// @flow

import { Localized } from "fluent-react/compat";
import React from "react";
import moment from "moment";
import { Helmet } from "react-helmet";

import { buildSurveyURL, experimentL10nId } from "../../lib/utils";

import NotFoundPage from "../NotFoundPage";

import View from "../../components/View";
import EmailDialog from "../../components/EmailDialog";
import ExperimentCardList from "../../components/ExperimentCardList";

import Banner from "../../components/Banner";
import LayoutWrapper from "../../components/LayoutWrapper";
import MobileDialog from "../../components/MobileDialog";

import ExperimentPreFeedbackDialog from "./ExperimentPreFeedbackDialog";
import ExperimentDisableDialog from "./ExperimentDisableDialog";
import ExperimentEolDialog from "./ExperimentEolDialog";
import ExperimentTourDialog from "../../components/ExperimentTourDialog";
import TestpilotPromo from "./TestpilotPromo";
import DetailsOverview from "./DetailsOverview";
import DetailsDescription from "./DetailsDescription";
import DetailsHeader from "./DetailsHeader";

import "./index.scss";

import type {
  ExperimentPageProps,
  ExperimentDetailProps,
  MouseEventWithElementTarget
} from "./types";

export default class ExperimentPage extends React.Component {
  props: ExperimentPageProps;

  render() {
    const { getExperimentBySlug, slug } = this.props;
    const experiment = getExperimentBySlug(slug);
    return <ExperimentDetail experiment={experiment} {...this.props} />;
  }
}

export class ExperimentDetail extends React.Component {
  props: ExperimentDetailProps;

  state: {
    enabled: boolean,
    highlightMeasurementPanel: boolean,
    isEnabling: boolean,
    isDisabling: boolean,
    progressButtonWidth: ?number,
    showEmailDialog: boolean,
    showDisableDialog: boolean,
    showTourDialog: boolean,
    showMobileDialog: boolean,
    showPreFeedbackDialog: boolean,
    showEolDialog: boolean
  };

  constructor(props: ExperimentDetailProps) {
    super(props);

    const {
      isExperimentEnabled,
      experiment
    } = this.props;

    // TODO: Clean this up per #1367
    this.state = {
      enabled: isExperimentEnabled(experiment),
      highlightMeasurementPanel: false,
      isEnabling: false,
      isDisabling: false,
      progressButtonWidth: null,
      showEmailDialog: false,
      showDisableDialog: false,
      showTourDialog: false,
      showMobileDialog: false,
      showPreFeedbackDialog: false,
      showEolDialog: false
    };
  }

  checkCookies() {
    const { getCookie, removeCookie, experiment } = this.props;
    const exp = getCookie("exp-installed");
    if (getCookie("txp-installed")) {
      removeCookie("txp-installed");
      this.setState({ showEmailDialog: true });
    } else if (exp && !this.state.showEmailDialog) {
      if (experiment && experiment.addon_id === exp) {
        removeCookie("exp-installed");
        this.setState({ showTourDialog: true });
      }
    }
  }

  componentWillMount() {
    this.checkCookies();
  }

  componentDidUpdate() {
    this.checkCookies();
  }

  componentWillReceiveProps(nextProps: ExperimentDetailProps) {
    const prevExperiment = this.props.experiment;
    const prevInProgress = prevExperiment && prevExperiment.inProgress;

    const nextExperiment = nextProps.experiment;
    const nextInProgress = nextExperiment && nextExperiment.inProgress;
    const nextEnabled =
      nextExperiment && nextProps.isExperimentEnabled(nextExperiment);

    if (!nextInProgress && prevInProgress !== nextInProgress) {
      this.setState({
        isEnabling: false,
        isDisabling: false
      });
    }

    this.setState({
      enabled: nextEnabled
    });
  }

  render() {
    const {
      installExperiment,
      uninstallExperiment,
      l10nId,
      uninstallExperimentWithSurvey,
      flashMeasurementPanel,
      doShowEolDialog,
      doShowTourDialog,
      doShowMobileAppDialog,
      doShowPreFeedbackDialog
    } = this;

    const {
      userAgent,
      experiment,
      experiments,
      installed,
      isAfterCompletedDate,
      isDev,
      isFirefox,
      isMinFirefox,
      hasAddon,
      clientUUID,
      installedAddons,
      setPageTitleL10N,
      locale,
      getElementOffsetHeight,
      getElementY,
      setScrollY,
      getScrollY,
      sendToGA,
      addScrollListener,
      removeScrollListener
    } = this.props;

    const {
      enabled,
      progressButtonWidth,
      highlightMeasurementPanel,
      showEmailDialog,
      showDisableDialog,
      showTourDialog,
      showPreFeedbackDialog,
      showEolDialog,
      showMobileDialog,
      isEnabling,
      isDisabling
    } = this.state;

    // Loading handled in static with react router; don't return anything if no experiments
    if (experiments.length === 0) {
      return null;
    }

    // Show a 404 page if an experiment for this slug wasn't found.
    if (!experiment) {
      return <NotFoundPage {...this.props} />;
    }

    const { title, survey_url, tour_steps } = experiment;
    const hasTour = typeof tour_steps !== "undefined";

    setPageTitleL10N("pageTitleExperiment", experiment);

    // Show a 404 page if an experiment is not ready for launch yet
    const utcNow = moment.utc();
    if (
      moment(utcNow).isBefore(experiment.launch_date) &&
      typeof experiment.launch_date !== "undefined" &&
      !isDev
    ) {
      return <NotFoundPage />;
    }

    const surveyURL = buildSurveyURL(
      "givefeedback",
      title,
      installed,
      clientUUID,
      survey_url
    );
    const graduated = isAfterCompletedDate(experiment);
    const currentExperiments = experiments.filter(
      x => !isAfterCompletedDate(x)
    );

    return (
      <section id="experiment-page">
        <Helmet>
          <title>Firefox Test Pilot - {title}</title>
        </Helmet>
        {tour_steps && tour_steps.map((step, key) => <link rel="preload" as="image" href={step.image} key={key}/>)}
        {showEmailDialog &&
          <EmailDialog
            {...this.props}
            onDismiss={() => {
              this.setState({ showEmailDialog: false });
            }}
          />}

        {showDisableDialog &&
          <ExperimentDisableDialog
            {...this.props}
            installed={installed}
            onCancel={() => this.setState({ showDisableDialog: false })}
            onSubmit={() => this.setState({ showDisableDialog: false })}
          />}

        {/* Only show the tour dialog if there are tour steps in the experiment YAML */}
        {hasTour && showTourDialog &&
          <ExperimentTourDialog
            {...this.props}
            onCancel={() => this.setState({ showTourDialog: false })}
            onComplete={() => this.setState({ showTourDialog: false })}
          />}

        {showMobileDialog &&
          <MobileDialog
            {...this.props}
            onCancel={() => this.setState({ showMobileDialog: false })}
          />}

        {showPreFeedbackDialog &&
          <ExperimentPreFeedbackDialog
            {...this.props}
            surveyURL={surveyURL}
            onCancel={() => this.setState({ showPreFeedbackDialog: false })}
          />}

        {showEolDialog &&
          <ExperimentEolDialog
            title={title}
            onCancel={() => this.setState({ showEolDialog: false })}
            onSubmit={e => {
              this.setState({ showEolDialog: false });
              this.uninstallExperiment(e);
            }}
          />}

        <View {...this.props}>
          {(!isFirefox || !isMinFirefox) && <TestpilotPromo
            {...{
              ...this.props,
              graduated,
              experiment
            }}
          />}
          <div className="default-background">
            <DetailsHeader
              {...{
                hasAddon,
                userAgent,
                experiment,
                enabled,
                installed,
                graduated,
                surveyURL,
                progressButtonWidth,
                flashMeasurementPanel,
                installExperiment,
                uninstallExperiment,
                isEnabling,
                isDisabling,
                uninstallExperimentWithSurvey,
                getElementOffsetHeight,
                getElementY,
                setScrollY,
                getScrollY,
                l10nId,
                sendToGA,
                doShowEolDialog,
                doShowPreFeedbackDialog,
                addScrollListener,
                removeScrollListener
              }}
            />
            <div id="details">
              <LayoutWrapper
                helperClass="details-content"
                flexModifier="details-content"
              >
                <DetailsOverview
                  {...{
                    isMinFirefox,
                    sendToGA,
                    userAgent,
                    hasAddon,
                    progressButtonWidth,
                    isDisabling,
                    isEnabling,
                    enabled,
                    installed,
                    graduated,
                    experiment,
                    surveyURL,
                    installExperiment,
                    doShowEolDialog,
                    doShowPreFeedbackDialog,
                    uninstallExperimentWithSurvey,
                    highlightMeasurementPanel,
                    flashMeasurementPanel,
                    doShowTourDialog,
                    doShowMobileAppDialog,
                    l10nId,
                    hasTour
                  }}
                />
                <DetailsDescription
                  {...{
                    experiment,
                    graduated,
                    locale,
                    hasAddon,
                    installedAddons,
                    highlightMeasurementPanel,
                    l10nId
                  }}
                />
              </LayoutWrapper>
            </div>
          </div>
          <Banner>
            <Localized id="otherExperiments">
              <h2 className="banner__subtitle centered">
                Try out these experiments as well
              </h2>
            </Localized>
            <LayoutWrapper flexModifier="card-list">
              <ExperimentCardList
                {...this.props}
                experiments={currentExperiments}
                except={experiment.slug}
                eventCategory="ExperimentsDetailPage Interactions"
              />
            </LayoutWrapper>
          </Banner>
        </View>
      </section>
    );
  }

  l10nId = (pieces: string) => experimentL10nId(this.props.experiment, pieces);

  installExperiment = (evt: MouseEventWithElementTarget) => {
    const { experiment, enableExperiment, sendToGA } = this.props;
    const { isEnabling } = this.state;

    evt.preventDefault();

    // Ignore subsequent clicks if already in progress
    if (isEnabling) {
      return;
    }

    let progressButtonWidth;
    if (this.props.hasAddon) {
      progressButtonWidth = evt.target.offsetWidth;
    }

    this.setState({
      isEnabling: true,
      isDisabling: false,
      progressButtonWidth
    });

    const eventCategory = "ExperimentDetailsPage Interactions";
    const eventLabel = `Install the Add-on from ${experiment.title}`;

    enableExperiment(experiment, eventCategory, eventLabel);

    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "Enable Experiment",
      eventLabel: experiment.title,
      dimension11: experiment.slug
    });
  };

  uninstallExperiment = (evt: MouseEventWithElementTarget) => {
    const { experiment, disableExperiment } = this.props;
    const { isDisabling } = this.state;

    evt.preventDefault();

    // Ignore subsequen clicks if already in progress
    if (isDisabling) {
      return;
    }

    this.props.sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "Disable Experiment",
      eventLabel: experiment.title,
      dimension11: experiment.slug
    });

    this.setState({
      isEnabling: false,
      isDisabling: true,
      progressButtonWidth: evt.target.offsetWidth
    });

    disableExperiment(experiment);
  };

  doShowMobileAppDialog = (evt: MouseEvent) => {
    evt.preventDefault();
    const { experiment }  = this.props;

    this.setState({ showMobileDialog: true });
    this.props.sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "mobile send click",
      eventLabel: experiment.title,
      dimension11: experiment.slug
    });
  };

  doShowTourDialog = (evt: MouseEvent) => {
    evt.preventDefault();
    this.setState({ showTourDialog: true });
  };

  doShowEolDialog = (evt: MouseEvent) => {
    evt.preventDefault();
    this.setState({ showEolDialog: true });
  };

  doShowPreFeedbackDialog = (evt: MouseEvent) => {
    evt.preventDefault();
    this.setState({ showPreFeedbackDialog: true });
  };

  uninstallExperimentWithSurvey = (evt: MouseEvent) => {
    evt.preventDefault();
    this.uninstallExperiment(evt);
    this.setState({ showDisableDialog: true });
  };

  flashMeasurementPanel = () => {
    this.setState({ highlightMeasurementPanel: true });
    setTimeout(() => {
      this.setState({ highlightMeasurementPanel: false });
    }, 5000);
  };
}
