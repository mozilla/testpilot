// @flow

import { Localized } from 'fluent-react/compat';
import React from 'react';
import moment from 'moment';

import { buildSurveyURL, experimentL10nId } from '../../lib/utils';

import NotFoundPage from '../NotFoundPage';

import View from '../../components/View';
import EmailDialog from '../../components/EmailDialog';
import ExperimentCardList from '../../components/ExperimentCardList';

import ExperimentPlatforms from '../../components/ExperimentPlatforms';
import Banner from '../../components/Banner';
import LayoutWrapper from '../../components/LayoutWrapper';

import ExperimentPreFeedbackDialog from './ExperimentPreFeedbackDialog';
import ExperimentDisableDialog from './ExperimentDisableDialog';
import ExperimentEolDialog from './ExperimentEolDialog';
import ExperimentTourDialog from './ExperimentTourDialog';
import TestpilotPromo from './TestpilotPromo';
import DetailsOverview from './DetailsOverview';
import DetailsDescription from './DetailsDescription';
import DetailsHeader from './DetailsHeader';

import './index.scss';

import type {
  ExperimentPageProps,
  ExperimentDetailProps,
  MouseEventWithElementTarget
} from './types';

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
    shouldShowTourDialog: boolean,
    showTourDialog: boolean,
    showPreFeedbackDialog: boolean,
    showEolDialog: boolean
  };

  constructor(props: ExperimentDetailProps) {
    super(props);

    const {
      isExperimentEnabled,
      experiment,
      getCookie,
      removeCookie,
      hasAddon
    } = this.props;

    let showEmailDialog = false;
    if (getCookie('first-run')) {
      removeCookie('first-run');
      if (hasAddon) {
        showEmailDialog = true;
      }
    }

    // TODO: Clean this up per #1367
    this.state = {
      enabled: isExperimentEnabled(experiment),
      highlightMeasurementPanel: false,
      isEnabling: false,
      isDisabling: false,
      progressButtonWidth: null,
      showEmailDialog,
      showDisableDialog: false,
      shouldShowTourDialog: false,
      showTourDialog: false,
      showPreFeedbackDialog: false,
      showEolDialog: false
    };
  }

  componentWillReceiveProps(nextProps: ExperimentDetailProps) {
    const { shouldShowTourDialog, enabled: prevEnabled } = this.state;

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

    // On enable state change, stop installation indicators & show tour dialog if needed.
    if (prevEnabled !== nextEnabled) {
      const showTourDialog = shouldShowTourDialog && nextEnabled;
      this.setState({
        shouldShowTourDialog: false,
        showTourDialog
      });
    }
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
      doShowPreFeedbackDialog
    } = this;

    const {
      userAgent,
      experiment,
      experiments,
      installed,
      isAfterCompletedDate,
      isDev,
      hasAddon,
      setExperimentLastSeen,
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

    const { title, survey_url } = experiment;

    setPageTitleL10N('pageTitleExperiment', experiment);

    // Show a 404 page if an experiment is not ready for launch yet
    const utcNow = moment.utc();
    if (
      moment(utcNow).isBefore(experiment.launch_date) &&
      typeof experiment.launch_date !== 'undefined' &&
      !isDev
    ) {
      return <NotFoundPage />;
    }

    // Set the timestamp for when this experiment was last seen (for
    // ExperimentRowCard updated/launched banner logic)
    setExperimentLastSeen(experiment);

    const surveyURL = buildSurveyURL(
      'givefeedback',
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
        {showEmailDialog &&
          <EmailDialog
            {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })}
          />}

        {showDisableDialog &&
          <ExperimentDisableDialog
            {...this.props}
            installed={installed}
            onCancel={() => this.setState({ showDisableDialog: false })}
            onSubmit={() => this.setState({ showDisableDialog: false })}
          />}

        {showTourDialog &&
          <ExperimentTourDialog
            {...this.props}
            onCancel={() => this.setState({ showTourDialog: false })}
            onComplete={() => this.setState({ showTourDialog: false })}
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
          <TestpilotPromo
            {...{
              ...this.props,
              graduated,
              experiment,
              installCallback: installExperiment
            }}
          />
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
              <LayoutWrapper>
                {experiment.platforms &&
                  <ExperimentPlatforms experiment={experiment} />}
              </LayoutWrapper>
              <LayoutWrapper
                helperClass="details-content"
                flexModifier="details-content"
              >
                <DetailsOverview
                  {...{
                    experiment,
                    graduated,
                    highlightMeasurementPanel,
                    doShowTourDialog,
                    l10nId
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

    let installAddonPromise = null;
    if (!this.props.hasAddon) {
      const { installAddon, requireRestart } = this.props;
      const eventCategory = 'ExperimentDetailsPage Interactions';
      const eventLabel = `Install the Add-on from ${experiment.title}`;
      installAddonPromise = installAddon(
        requireRestart,
        sendToGA,
        eventCategory,
        eventLabel
      );
    }
    let progressButtonWidth;
    if (this.props.hasAddon) {
      progressButtonWidth = evt.target.offsetWidth;
    }

    this.setState({
      isEnabling: true,
      isDisabling: false,
      shouldShowTourDialog: true,
      progressButtonWidth
    });

    function finishEnabling() {
      enableExperiment(experiment);

      sendToGA('event', {
        eventCategory: 'ExperimentDetailsPage Interactions',
        eventAction: 'Enable Experiment',
        eventLabel: experiment.title
      });
    }

    if (installAddonPromise === null) {
      finishEnabling();
      return;
    }

    installAddonPromise
      .then(() => {
        return new Promise((resolve, reject) => {
          let i = 0;
          const interval = setInterval(() => {
            i++;
            if (this.props.hasAddon) {
              clearInterval(interval);
              resolve();
            } else if (i > 2000) {
              clearInterval(interval);
              reject(new Error('hasAddon still false after 200 seconds'));
            }
          }, 100);
        });
      })
      .then(finishEnabling);
  };

  uninstallExperiment = (evt: MouseEventWithElementTarget) => {
    const { experiment, disableExperiment } = this.props;
    const { isDisabling } = this.state;

    evt.preventDefault();

    // Ignore subsequen clicks if already in progress
    if (isDisabling) {
      return;
    }

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Disable Experiment',
      eventLabel: experiment.title
    });

    this.setState({
      isEnabling: false,
      isDisabling: true,
      progressButtonWidth: evt.target.offsetWidth
    });

    disableExperiment(experiment);
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
