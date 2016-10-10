import React from 'react';
import moment from 'moment';

import classnames from 'classnames';

import { buildSurveyURL, formatDate, createMarkup } from '../lib/utils';

import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ExperimentDisableDialog from '../components/ExperimentDisableDialog';
import ExperimentTourDialog from '../components/ExperimentTourDialog';
import MainInstallButton from '../components/MainInstallButton';
import ExperimentCardList from '../components/ExperimentCardList';
import ExperimentPreFeedbackDialog from '../components/ExperimentPreFeedbackDialog';

const CHANGE_HEADER_ON = 105;

export default class ExperimentPage extends React.Component {

  constructor(props) {
    super(props);

    const { isExperimentEnabled, experiment } = this.props;

    // TODO: Clean this up per #1367
    this.state = {
      enabled: isExperimentEnabled(experiment),
      useStickyHeader: false,
      highlightMeasurementPanel: false,
      isEnabling: false,
      isDisabling: false,
      progressButtonWidth: null,
      showDisableDialog: false,
      shouldShowTourDialog: false,
      showTourDialog: false,
      showPreFeedbackDialog: false
    };

    // HACK: Set this as a plain object property, so we don't trigger crazy
    // state changes on scrolling events.
    this.didScroll = false;
  }

  componentWillReceiveProps(nextProps) {
    const { shouldShowTourDialog, enabled: prevEnabled } = this.state;

    const prevExperiment = this.props.experiment;
    const prevInProgress = prevExperiment && prevExperiment.inProgress;

    const nextExperiment = nextProps.experiment;
    const nextInProgress = nextExperiment && nextExperiment.inProgress;
    const nextEnabled = nextExperiment && nextProps.isExperimentEnabled(nextExperiment);

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
      // TODO: Tweak experiment install count?
      const showTourDialog = shouldShowTourDialog &&
                             nextExperiment &&
                             !nextExperiment.error;
      this.setState({
        shouldShowTourDialog: false,
        showTourDialog
      });
    }
  }

  isValidVersion(min) {
    const version = parseInt(this.props.userAgent.split('/').pop(), 10);
    return typeof min === 'undefined' || version >= min;
  }

  getIncompatibleInstalled(incompatible) {
    if (!incompatible) {
      return [];
    }
    const installed = this.props.installedAddons || [];
    return Object.keys(incompatible).filter(guid => (
      installed.indexOf(guid) !== -1
    ));
  }

  renderIncompatibleAddons() {
    const { incompatible } = this.props.experiment;
    const installed = this.getIncompatibleInstalled(incompatible);
    if (installed.length === 0) return null;

    const helpUrl = 'https://support.mozilla.org/kb/disable-or-remove-add-ons';

    return (
      <section className="incompatible-addons">
        <header>
          <h3 data-l10n-id="incompatibleHeader">
            This experiment may not be compatible with add-ons you have installed.
          </h3>
          <p data-l10n-id="incompatibleSubheader" data-l10n-args={JSON.stringify({ url: helpUrl })}>
            We recommend <a href={helpUrl}>disabling these add-ons</a> before activating this experiment:
          </p>
        </header>
        <ul>
          {installed.map(guid => (
            <li key={guid}>{incompatible[guid]}</li>
          ))}
        </ul>
      </section>
    );
  }

  render() {
    const { experiment, experiments, installed, isDev, hasAddon } = this.props;

    // Show the loading animation if experiments haven't been loaded yet.
    if (experiments.length === 0) { return <LoadingPage />; }

    // Show a 404 page if an experiment for this slug wasn't found.
    if (!experiment) { return <NotFoundPage />; }

    // Show a 404 page if an experiment is not ready for launch yet
    const utcNow = moment.utc();
    if (moment(utcNow).isBefore(experiment.launch_date)
        && typeof experiment.launch_date !== 'undefined'
        && !isDev) {
      return <NotFoundPage />;
    }

    const { enabled, useStickyHeader, highlightMeasurementPanel,
            showDisableDialog, showTourDialog, isEnabling, isDisabling,
            progressButtonWidth, showPreFeedbackDialog } = this.state;

    const { title, version, contribute_url, bug_report_url, discourse_url,
            introduction, measurements, privacy_notice_url, changelog_url,
            thumbnail, survey_url, contributors, details, min_release } = experiment;

    // TODO: #1138 - add optional subtitles the right way
    const subtitle = (title === 'No More 404s') ? 'Powered by the Wayback Machine' : '';
    const installation_count = (experiment.installation_count) ? experiment.installation_count.toLocaleString() : '0';
    const surveyURL = buildSurveyURL('givefeedback', title, installed, survey_url);
    const modified = formatDate(experiment.modified);
    const completedDate = experiment.completed ? formatDate(experiment.completed) : null;
    const validVersion = this.isValidVersion(min_release);

    let statusType = null;
    if (experiment.error) {
      statusType = 'error';
    } else if (enabled) {
      statusType = 'enabled';
    }

    return (
      <section id="details" data-hook="experiment-page">

        {showDisableDialog &&
          <ExperimentDisableDialog {...this.props}
            installed={installed}
            onCancel={() => this.setState({ showDisableDialog: false })}
            onSubmit={() => this.setState({ showDisableDialog: false })} />}

        {showTourDialog &&
          <ExperimentTourDialog {...this.props}
            onCancel={() => this.setState({ showTourDialog: false })}
            onComplete={() => this.setState({ showTourDialog: false })} />}

        {showPreFeedbackDialog &&
          <ExperimentPreFeedbackDialog {...this.props}
            surveyURL={surveyURL}
            onCancel={() => this.setState({ showPreFeedbackDialog: false })} />}

        <Header {...this.props} />

        {!hasAddon && <section data-hook="testpilot-promo">
          <div className="experiment-promo">
            <div className="reverse-split-banner responsive-content-wrapper">
              <div className="copter-wrapper fly-up">
                <div className="copter"></div>
              </div>
              <div className="intro-text">
                <h2 className="banner">
                  <span data-l10n-id="experimentPromoHeader" className="block">Ready for Takeoff?</span>
                </h2>
                <p data-l10n-id="experimentPromoSubheader">We're building next-generation features for Firefox. Install Test Pilot to try them!</p>
                <MainInstallButton {...this.props}
                                   eventCategory="HomePage Interactions"
                                   experimentTitle={title} />
              </div>
            </div>
          </div>
        </section>}

        <div className="default-background">
          <div data-hook="has-status" className={classnames(
              'details-header-wrapper',
              { 'has-status': !!statusType, stick: useStickyHeader })
            }>
            <div data-hook="status-type" className={classnames('status-bar', statusType)}>
              {(statusType === 'enabled') && <span data-hook="enabled-msg" data-l10n-id="isEnabledStatusMessage" data-l10n-args={JSON.stringify({ title })}><span data-hook="title">{title}</span> is enabled.</span>}
              {(statusType === 'error') && <span data-hook="error-msg" data-l10n-id="installErrorMessage" data-l10n-args={JSON.stringify({ title })}>Uh oh. <span data-hook="title">{title}</span> could not be enabled. Try again later.</span>}
            </div>
            <div className="details-header responsive-content-wrapper">
              <header>
                <h1 data-hook="title">{title}</h1>
                <h4 data-hook="subtitle" className="subtitle">{subtitle}</h4>
              </header>
              {hasAddon && validVersion && <div className="experiment-controls" data-hook="active-user">
                {!enabled && <a onClick={e => this.highlightPrivacy(e)} data-hook="highlight-privacy" className="highlight-privacy" data-l10n-id="highlightPrivacy">Your privacy</a>}
                {enabled && <a onClick={e => this.handleFeedback(e)} data-l10n-id="giveFeedback" data-hook="feedback" id="feedback-button" className="button default" href={surveyURL}>Give Feedback</a>}
                {enabled && <button onClick={e => this.renderUninstallSurvey(e)} style={{ width: progressButtonWidth }} data-hook="uninstall-experiment" id="uninstall-button" className={classnames(['button', 'secondary'], { 'state-change': isDisabling })}><span className="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" className="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text">Disable <span data-hook="title">{title}</span></span></button>}
                {!enabled && <button onClick={e => this.installExperiment(e)} style={{ width: progressButtonWidth }} data-hook="install-experiment" id="install-button"  className={classnames(['button', 'default'], { 'state-change': isEnabling })}><span className="state-change-inner"></span><span data-l10n-id="enableExperimentTransition" className="transition-text">Enabling...</span><span data-l10n-id="enableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text">Enable <span data-hook="title">{title}</span></span></button>}
              </div>}
              { this.renderMinimumVersionNotice(title, hasAddon, min_release) }
            </div>
          </div>
          <div className="sticky-header-sibling"></div>

          <div data-hook="details">
              <div className="details-content responsive-content-wrapper">
                <div className="details-overview">
                  <div className="experiment-icon-wrapper" data-hook="bg"
                       style={{
                         backgroundColor: `${experiment.gradient_start}`,
                         backgroundImage: `linear-gradient(135deg, ${experiment.gradient_start}, ${experiment.gradient_stop})`
                       }}>
                    <img className="experiment-icon" data-hook="thumbnail" src={thumbnail}></img>
                  </div>
                  <div className="details-sections">
                    <section className="user-count">
                      { this.renderInstallationCount(installation_count, title) }
                    </section>
                    {!hasAddon && <div data-hook="inactive-user">
                      {!!introduction && <section className="introduction" data-hook="introduction-container">
                        <div data-hook="introduction-html" dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                      </section>}
                    </div>}
                    {hasAddon && <section className="stats-section" data-hook="active-user">
                      <table className="stats"><tbody>
                        <tr data-hook="version-container">
                          <td data-l10n-id="version">Version</td>
                          <td>
                            <span data-hook="version">{version}</span>
                            &nbsp;
                            {changelog_url && <a data-l10n-id="changelog" data-hook="changelog-url" href={changelog_url}>changelog</a>}
                          </td>
                        </tr>
                        <tr>
                          <td data-l10n-id="lastUpdate">Last Update</td>
                          <td data-hook="modified-date">{modified}</td>
                        </tr>
                        <tr>
                          <td data-l10n-id="contribute">Contribute</td>
                          <td><a data-hook="contribute-url" href={contribute_url}>{contribute_url}</a></td>
                        </tr>

                        <tr>
                          <td data-l10n-id="bugReports">Bug Reports</td>
                          <td><a data-hook="bug-report-url" href={bug_report_url}>{bug_report_url}</a></td>
                        </tr>

                        <tr>
                          <td data-l10n-id="discourse">Discourse</td>
                          <td><a data-hook="discourse-url" href={discourse_url}>{discourse_url}</a></td>
                        </tr>
                      </tbody></table>
                    </section>}
                    <section className="contributors-section">
                      <h3 data-l10n-id="contributorsHeading">Brought to you by</h3>
                      <ul className="contributors">
                        {contributors.map((contributor, idx) => (
                          <li key={idx}>
                            <img className="avatar" data-hook="avatar" width="56" height="56" src={contributor.avatar} />
                            <div className="contributor">
                              <p data-hook="name" className="name">{contributor.display_name}</p>
                              <p data-hook="title" className="title">{contributor.title}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    {hasAddon && <div data-hook="active-user">
                      {measurements && <section data-hook="measurements-container"
                          className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                        <h3 data-l10n-id="measurements">Your privacy</h3>
                        <div data-hook="measurements-html" className="measurement" dangerouslySetInnerHTML={createMarkup(measurements)}></div>
                        {privacy_notice_url && <a className="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-l10n-args={JSON.stringify({ title })} data-hook="privacy-notice-url" href={privacy_notice_url}>You can learn more about the data collection for <span data-hook="title">{title}</span> here.</a>}
                      </section>}
                    </div>}
                  </div>
                </div>

                <div className="details-description">
                  {this.renderIncompatibleAddons()}
                  {completedDate && <div data-hook="eol-message">
                    <div className="eol-block"><div data-hook="ending-soon" data-l10n-id="eolMessage" data-l10n-args={JSON.stringify({ title, completedDate })}>
                        <strong>This experiment is ending on <span data-hook="completedDate">{completedDate}</span></strong>.<br/><br/>
                        After then you will still be able to use <span data-hook="title">{title}</span> but we will no longer be providing updates or support.</div>
                    </div>
                  </div>}
                  {hasAddon && <div data-hook="active-user">
                    {!!introduction && <section className="introduction" data-hook="introduction-container">
                      <div data-hook="introduction-html" dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                    </section>}
                  </div>}
                  <div className="details-list">
                    {details.map((detail, idx) => (
                     <div key={idx}>
                       <div data-hook="details" className="details-image">
                         <img data-hook="detail-image" width="680" src={detail.image} />
                         <p className="caption"><strong data-hook="detail-headline">{detail.headline}</strong> <span data-hook="detail-copy" dangerouslySetInnerHTML={createMarkup(detail.copy)}></span></p>
                       </div>
                     </div>
                    ))}
                  </div>
                  {hasAddon && <div data-hook="active-user">
                    {measurements && <section data-hook="measurements-container"
                          className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                      <h3 data-l10n-id="measurements">Your privacy</h3>
                      <div data-hook="measurements-html" className="measurement" dangerouslySetInnerHTML={createMarkup(measurements)}></div>
                      <a className="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-hook="privacy-notice-url">You can learn more about the data collection for <span data-hook="title">{title}</span> here.</a>
                    </section>}
                  </div>}
                </div>
              </div>
            </div>
          </div>
          {!hasAddon && <div data-hook="inactive-user">
            <h2 className="card-list-header" data-l10n-id="otherExperiments">Try out these experiments as well</h2>
            <div className="responsive-content-wrapper delayed-fade-in" data-hook="experiment-list">
              <ExperimentCardList {...this.props}
                                  except={experiment.slug}
                                  eventCategory="ExperimentsDetailPage Interactions" />
            </div>
          </div>}
          <footer id="main-footer" className="responsive-content-wrapper">
            <Footer {...this.props} />
          </footer>
      </section>
    );
  }

  componentDidMount() {
    this.scrollListener = () => {
      if (!this.didScroll && this.props.hasAddon) {
        this.didScroll = true;
        setTimeout(this.onScroll.bind(this), 1);
      }
    };
    this.props.addScrollListener(this.scrollListener);
  }

  componentWillUnmount() {
    this.props.removeScrollListener(this.scrollListener);
  }

  onScroll() {
    const sy = this.props.getScrollY();
    this.setState({ useStickyHeader: sy > CHANGE_HEADER_ON });
    this.didScroll = false;
  }

  // this is set to 100, to accomodate Tracking Protection
  // which has been sending telemetry pings via installs from dev
  // TODO: figure out a non-hack way to toggle user counts when we have
  // telemetry data coming in from prod
  renderInstallationCount(installation_count, title) {
    if (installation_count <= 100) {
      return (
        <span data-l10n-id="userCountContainerAlt" className="bold" data-l10n-args={JSON.stringify({ title })}>
        Just launched!</span>
      );
    }
    return (
      <span data-l10n-id="userCountContainer" data-l10n-args={JSON.stringify({ installation_count, title })}>There are <span data-l10n-id="userCount" className="bold" data-hook="install-count">{installation_count}</span>
      people trying <span data-hook="title">{title}</span> right now!</span>
    );
  }

  renderMinimumVersionNotice(title, hasAddon, min_release) {
    if (hasAddon && !this.isValidVersion(min_release)) {
      return (
        <div className="upgrade-notice">
          <div data-l10n-id="upgradeNoticeTitle" data-l10n-args={JSON.stringify({ title, min_release })}>{title} requires Firefox {min_release} or later.</div>
          <a onClick={e => this.clickUpgradeNotice(e)} data-l10n-id="upgradeNoticeLink" href="https://support.mozilla.org/kb/find-what-version-firefox-you-are-using" target="_blank">How to update Firefox.</a>
        </div>
      );
    }
    return null;
  }

  highlightPrivacy(evt) {
    const { getElementY, setScrollY } = this.props;
    evt.preventDefault();
    setScrollY(getElementY('.measurements') - CHANGE_HEADER_ON);
    this.setState({
      useStickyHeader: true,
      highlightMeasurementPanel: true
    });
    setTimeout(() => {
      this.setState({ highlightMeasurementPanel: false });
    }, 5000);
  }

  clickUpgradeNotice() {
    // If a user goes to the upgrade SUMO
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Upgrade Notice'
    });
  }

  feedback(evt) {
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Give Feedback',
      outboundURL: evt.target.getAttribute('href')
    });
  }

  showPreFeedbackDialog() {
    this.setState({
      showPreFeedbackDialog: true
    });
  }

  handleFeedback(evt) {
    evt.preventDefault();
    const { pre_feedback_copy } = this.props.experiment;
    if (pre_feedback_copy === null || !pre_feedback_copy) {
      this.feedback(evt);
    } else {
      this.showPreFeedbackDialog();
    }
  }

  installExperiment(evt) {
    const { experiment, enableExperiment, sendToGA } = this.props;
    const { isEnabling } = this.state;

    evt.preventDefault();

    // Ignore subsequent clicks if already in progress
    if (isEnabling) { return; }

    this.setState({
      isEnabling: true,
      isDisabling: false,
      shouldShowTourDialog: true,
      progressButtonWidth: evt.target.offsetWidth
    });

    enableExperiment(experiment);

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Enable Experiment'
    });
  }

  uninstallExperiment(evt) {
    const { experiment, disableExperiment } = this.props;
    const { isDisabling } = this.state;

    evt.preventDefault();

    // Ignore subsequen clicks if already in progress
    if (isDisabling) { return; }

    this.setState({
      isEnabling: false,
      isDisabling: true,
      progressButtonWidth: evt.target.offsetWidth
    });

    disableExperiment(experiment);
  }

  renderUninstallSurvey(evt) {
    evt.preventDefault();

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Disable Experiment'
    });

    this.uninstallExperiment(evt);

    this.setState({ showDisableDialog: true });
  }

}

ExperimentPage.propTypes = {
  userAgent: React.PropTypes.string,
  isDev: React.PropTypes.bool,
  hasAddon: React.PropTypes.bool,
  experiments: React.PropTypes.array,
  installed: React.PropTypes.object,
  installedAddons: React.PropTypes.array,
  navigateTo: React.PropTypes.func,
  isExperimentEnabled: React.PropTypes.func,
  requireRestart: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func,
  uninstallAddon: React.PropTypes.func,
  enableExperiment: React.PropTypes.func,
  disableExperiment: React.PropTypes.func,
  addScrollListener: React.PropTypes.func,
  removeScrollListener: React.PropTypes.func,
  getScrollY: React.PropTypes.func,
  setScrollY: React.PropTypes.func,
  getElementY: React.PropTypes.func
};
