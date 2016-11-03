import React from 'react';
import moment from 'moment';

import classnames from 'classnames';

import { buildSurveyURL, createMarkup, experimentL10nId, formatDate } from '../lib/utils';

import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';

import EmailDialog from '../components/EmailDialog';
import ExperimentDisableDialog from '../components/ExperimentDisableDialog';
import ExperimentEolDialog from '../components/ExperimentEolDialog';
import ExperimentTourDialog from '../components/ExperimentTourDialog';
import MainInstallButton from '../components/MainInstallButton';
import ExperimentCardList from '../components/ExperimentCardList';
import ExperimentPreFeedbackDialog from '../components/ExperimentPreFeedbackDialog';
import View from '../components/View';
import Warning from '../components/Warning';


export default class ExperimentPage extends React.Component {
  render() {
    const { getExperimentBySlug, params } = this.props;
    const experiment = getExperimentBySlug(params.slug);
    return <ExperimentDetail experiment={experiment} {...this.props} />;
  }
}


ExperimentPage.propTypes = {
  getExperimentBySlug: React.PropTypes.func,
  params: React.PropTypes.shape({
    slug: React.PropTypes.string
  })
};


export class ExperimentDetail extends React.Component {

  constructor(props) {
    super(props);

    const { isExperimentEnabled, experiment,
            getCookie, removeCookie } = this.props;

    let showEmailDialog = false;
    if (getCookie('first-run')) {
      removeCookie('first-run');
      showEmailDialog = true;
    }

    // TODO: Clean this up per #1367
    this.state = {
      enabled: isExperimentEnabled(experiment),
      useStickyHeader: false,
      highlightMeasurementPanel: false,
      isEnabling: false,
      isDisabling: false,
      progressButtonWidth: null,
      showEmailDialog,
      showDisableDialog: false,
      shouldShowTourDialog: false,
      showTourDialog: false,
      showPreFeedbackDialog: false,
      changeHeaderOn: 125,
      stickyHeaderSiblingHeight: 0,
      privacyScrollOffset: 15,
      showEolDialog: false
    };

    // HACK: Set this as a plain object property, so we don't trigger crazy
    // state changes on scrolling events.
    this.didScroll = false;
  }

  l10nId(pieces) {
    return experimentL10nId(this.props.experiment, pieces);
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
          <p data-l10n-id="incompatibleSubheader">
            We recommend <a href={helpUrl}>disabling these add-ons</a> before activating this experiment:
          </p>
        </header>
        <main>
          <ul>
            {installed.map(guid => (
              <li key={guid}>{incompatible[guid]}</li>
            ))}
          </ul>
        </main>
      </section>
    );
  }

  renderLocaleWarning() {
    const { experiment, locale } = this.props;
    if (experiment.locales && locale && !experiment.locales.includes(locale)) {
      return (
        <Warning titleL10nId="localeWarningTitle"
                 title="This experiment is only available in English."
                 subtitleL10nId="localeWarningSubtitle"
                 subtitle="You can still install it if you like." />
      );
    }
    return null;
  }

  render() {
    const { experiment, experiments, installed, isDev, hasAddon, setExperimentLastSeen, clientUUID } = this.props;

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
            showEmailDialog, showDisableDialog, showTourDialog,
            showPreFeedbackDialog, showEolDialog,
            stickyHeaderSiblingHeight } = this.state;

    const { title, version, contribute_url, bug_report_url, discourse_url,
            introduction, measurements, privacy_notice_url, changelog_url,
            thumbnail, subtitle, survey_url, contributors, details,
            min_release } = experiment;

    // Set the timestamp for when this experiment was last seen (for
    // ExperimentRowCard updated/launched banner logic)
    setExperimentLastSeen(experiment);

    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
    const modified = formatDate(experiment.modified);

    let statusType = null;
    if (experiment.error) {
      statusType = 'error';
    } else if (enabled) {
      statusType = 'enabled';
    }

    return (
      <section id="details" data-hook="experiment-page">

        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

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

        {showEolDialog &&
          <ExperimentEolDialog
            title={title}
            onCancel={() => this.setState({ showEolDialog: false })}
            onSubmit={e => {
              this.setState({ showEolDialog: false });
              this.renderUninstallSurvey(e);
            }} />}

        <View {...this.props}>

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
                {subtitle && <h4 data-hook="subtitle" className="subtitle" data-l10n-id={this.l10nId('subtitle')}>{subtitle}</h4>}
              </header>
              { this.renderExperimentControls() }
              { this.renderMinimumVersionNotice(title, hasAddon, min_release) }
            </div>
          </div>
          <div className="sticky-header-sibling" style={{ height: `${stickyHeaderSiblingHeight}px` }} ></div>

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
                      { this.renderInstallationCount() }
                    </section>
                    {!hasAddon && <div data-hook="inactive-user">
                      {!!introduction && <section className="introduction" data-hook="introduction-container">
                        <div data-l10n-id={this.l10nId('introduction')} data-hook="introduction-html" dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                      </section>}
                    </div>}
                    {hasAddon && <section className="stats-section" data-hook="active-user">
                      <table className="stats"><tbody>
                        <tr data-hook="version-container">
                          <td data-l10n-id="version">Version</td>
                          <td>
                            <span data-hook="version">{version}</span>
                            {changelog_url && <span>&nbsp;<a data-l10n-id="changelog" data-hook="changelog-url" href={changelog_url}>changelog</a>,</span>}
                            &nbsp;
                            <a className="showTour" data-l10n-id="tourLink" onClick={e => this.showTour(e)} href="#">tour</a>
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
                              {contributor.title && <p data-hook="title" className="title" data-l10n-id={this.l10nId(['contributors', idx, 'title'])}>{contributor.title}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    {hasAddon && <div data-hook="active-user">
                      {measurements && <section data-hook="measurements-container"
                          className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                        <h3 data-l10n-id="measurements">Your privacy</h3>
                        <div data-hook="measurements-html" data-l10n-id={this.l10nId('measurements')} className="measurement" dangerouslySetInnerHTML={createMarkup(measurements)}></div>
                        {privacy_notice_url && <a className="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-l10n-args={JSON.stringify({ title })} data-hook="privacy-notice-url" href={privacy_notice_url}>You can learn more about the data collection for <span data-hook="title">{title}</span> here.</a>}
                      </section>}
                    </div>}
                  </div>
                </div>

                <div className="details-description">
                  {this.renderIncompatibleAddons()}
                  {this.renderLocaleWarning()}
                  {this.renderEolBlock()}
                  {hasAddon && <div data-hook="active-user">
                    {!!introduction && <section className="introduction" data-hook="introduction-container">
                      <div data-hook="introduction-html" data-l10n-id={this.l10nId('description')} dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                    </section>}
                  </div>}
                  <div className="details-list">
                    {details.map((detail, idx) => (
                     <div key={idx}>
                       <div data-hook="details" className="details-image">
                         <img data-hook="detail-image" width="680" src={detail.image} />
                         <p className="caption">
                           {detail.headline && <strong data-hook="detail-headline" data-l10n-id={this.l10nId(['details', idx, 'headline'])}>{detail.headline}</strong>}
                           {detail.copy && <span data-hook="detail-copy" data-l10n-id={this.l10nId(['details', idx, 'copy'])} dangerouslySetInnerHTML={createMarkup(detail.copy)}></span>}
                         </p>
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
        </View>
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
    const { getElementOffsetHeight, getScrollY } = this.props;
    const sy = getScrollY();
    const detailsHeaderWrapperHeight = getElementOffsetHeight('.details-header-wrapper');
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const useStickyHeader = sy > changeHeaderOn;
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, useStickyHeader);

    this.setState({
      changeHeaderOn,
      useStickyHeader,
      stickyHeaderSiblingHeight });
    this.didScroll = false;
  }

  // if there is no content in the .status-bar
  // adjust the initial snap position and the header isn't yet sticky, adjust
  // changeHeaderOn to the top of the .details-header
  // instead of the bottom of the #main-header
  setChangeHeaderOn(detailsHeaderWrapperHeight) {
    const { getElementOffsetHeight, experiment } = this.props;
    const statusBar = experiment.error || this.state.enabled;
    const detailsHeaderHeight = getElementOffsetHeight('.details-header');
    let changeHeaderOn = getElementOffsetHeight('#main-header');

    if (!statusBar) {
      if (this.state.useStickyHeader) {
        changeHeaderOn = this.state.stickyHeaderSiblingHeight;
      } else {
        changeHeaderOn += (detailsHeaderWrapperHeight - detailsHeaderHeight);
      }
    }

    return changeHeaderOn;
  }

  // modify the height of the .sticky-header-sibling if useStickyHeader.
  // Since the height of the details header changes height depending on
  // whether there is a visible status, always set the state to whatever
  // is tallest
  setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, useStickyHeader) {
    let stickyHeaderSiblingHeight = 0;

    if (useStickyHeader) {
      stickyHeaderSiblingHeight = Math.max(
        detailsHeaderWrapperHeight, this.state.stickyHeaderSiblingHeight);
    }

    return stickyHeaderSiblingHeight;
  }

  // this is set to 100, to accomodate Tracking Protection
  // which has been sending telemetry pings via installs from dev
  // TODO: figure out a non-hack way to toggle user counts when we have
  // telemetry data coming in from prod
  renderInstallationCount() {
    const { experiment, isAfterCompletedDate } = this.props;
    const { completed, title, installation_count } = experiment;

    if (isAfterCompletedDate(experiment)) {
      const completedDate = formatDate(completed);
      return (
        <span data-l10n-id="completedDateLabel" data-l10n-args={JSON.stringify({ completedDate })}>Experiment End Date: {completedDate}</span>
      );
    }
    if (!installation_count || installation_count <= 100) {
      return (
        <span data-l10n-id="userCountContainerAlt" className="bold" data-l10n-args={JSON.stringify({ title })}>
        Just launched!</span>
      );
    }
    const installCount = installation_count.toLocaleString();
    return (
      // Note: this doesn't include the text content because of a conflict
      // in how l20n and react modify the dom.
      // https://github.com/mozilla/testpilot/pull/1712
      <span data-l10n-id="userCountContainer" data-l10n-args={JSON.stringify({ installation_count: installCount, title })}><span className="bold"></span></span>
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

  renderExperimentControls() {
    const { enabled, isEnabling, isDisabling, progressButtonWidth } = this.state;
    const { experiment, installed, isAfterCompletedDate, hasAddon, clientUUID } = this.props;
    const { title, min_release, survey_url } = experiment;
    const validVersion = this.isValidVersion(min_release);
    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);

    if (!hasAddon || !validVersion) {
      return null;
    }
    if (isAfterCompletedDate(experiment)) {
      if (enabled) {
        return (
          <div className="experiment-controls">
            <button onClick={e => { e.preventDefault(); this.setState({ showEolDialog: true }); }} style={{ width: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'secondary', 'warning'], { 'state-change': isDisabling })}><span className="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" className="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text">Disable {title}</span></button>
          </div>
        );
      }
      return null;
    }
    if (enabled) {
      return (
        <div className="experiment-controls">
          <a onClick={e => this.handleFeedback(e)} data-l10n-id="giveFeedback" id="feedback-button" className="button default" href={surveyURL}>Give Feedback</a>
          <button onClick={e => this.renderUninstallSurvey(e)} style={{ width: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'secondary'], { 'state-change': isDisabling })}><span className="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" className="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text">Disable {title}</span></button>
        </div>
      );
    }
    return (
      <div className="experiment-controls">
        <a onClick={e => this.highlightPrivacy(e)} className="highlight-privacy" data-l10n-id="highlightPrivacy">Your privacy</a>
        <button onClick={e => this.installExperiment(e)} style={{ width: progressButtonWidth }} id="install-button"  className={classnames(['button', 'default'], { 'state-change': isEnabling })}><span className="state-change-inner"></span><span data-l10n-id="enableExperimentTransition" className="transition-text">Enabling...</span><span data-l10n-id="enableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text">Enable {title}</span></button>
      </div>
    );
  }

  renderEolBlock() {
    const { experiment, isAfterCompletedDate } = this.props;
    if (!experiment.completed || isAfterCompletedDate(experiment)) { return null; }

    const title = experiment.title;
    const completedDate = formatDate(experiment.completed);

    return (
      <div className="eol-block">
        <div data-l10n-id="eolMessage" data-l10n-args={JSON.stringify({ title, completedDate })}>
          <strong>This experiment is ending on {completedDate}</strong>.<br/><br/>
          <span>After then you will still be able to use {title} but we will no longer be providing updates or support.</span>
        </div>
      </div>
    );
  }

  // scrollOffset lets us scroll to the top of the highlight box shadow animation
  highlightPrivacy(evt) {
    const { getElementOffsetHeight, getElementY, setScrollY } = this.props;
    const { privacyScrollOffset } = this.state;
    const detailsHeaderWrapperHeight = getElementOffsetHeight('.details-header-wrapper');
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, true);
    evt.preventDefault();
    setScrollY(getElementY('.measurements') + (stickyHeaderSiblingHeight - privacyScrollOffset));
    this.setState({
      changeHeaderOn,
      stickyHeaderSiblingHeight,
      useStickyHeader: true,
      highlightMeasurementPanel: true
    });
    setTimeout(() => {
      this.setState({ highlightMeasurementPanel: false });
    }, 5000);
  }

  clickUpgradeNotice() {
    const { experiment } = this.props;
    // If a user goes to the upgrade SUMO
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Upgrade Notice',
      eventLabel: experiment.title
    });
  }

  feedback(evt) {
    const { experiment } = this.props;
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Give Feedback',
      eventLabel: experiment.title,
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
      eventAction: 'Enable Experiment',
      eventLabel: experiment.title
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
    const { experiment } = this.props;
    evt.preventDefault();

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Disable Experiment',
      eventLabel: experiment.title
    });

    this.uninstallExperiment(evt);

    this.setState({ showDisableDialog: true });
  }

  showTour(e) {
    e.preventDefault();
    this.setState({ showTourDialog: true });
  }

}

ExperimentDetail.propTypes = {
  userAgent: React.PropTypes.string,
  clientUUID: React.PropTypes.string,
  isDev: React.PropTypes.bool,
  hasAddon: React.PropTypes.bool,
  experiments: React.PropTypes.array,
  installed: React.PropTypes.object,
  installedAddons: React.PropTypes.array,
  navigateTo: React.PropTypes.func,
  isAfterCompletedDate: React.PropTypes.func,
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
  getElementY: React.PropTypes.func,
  getElementOffsetHeight: React.PropTypes.func,
  setExperimentLastSeen: React.PropTypes.func
};
