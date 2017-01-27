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
            getCookie, removeCookie, hasAddon } = this.props;

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
    if (locale && ((experiment.locales && !experiment.locales.includes(locale)) || (experiment.locale_blocklist && experiment.locale_blocklist.includes(locale)))) {
      return (
        <Warning titleL10nId="localeUnavailableWarningTitle"
                 titleL10nArgs={ JSON.stringify({ locale_code: locale }) }
                 title="This experiment is not supported in your language (en)."
                 subtitleL10nId="localeWarningSubtitle"
                 subtitle="You can still enable it if you like." />
      );
    }
    return null;
  }

  renderEolBlock() {
    const { experiment, isAfterCompletedDate } = this.props;
    if (!experiment.completed || isAfterCompletedDate(experiment)) { return null; }

    const completedDate = formatDate(experiment.completed);
    const title = `${experiment.title} is ending on ${completedDate}`;

    return (
      <Warning titleL10nId="eolIntroMessage"
               titleL10nArgs={ JSON.stringify({ title: experiment.title, completedDate }) }
               title={ title }>
        { experiment.eol_warning }
        <div className="small-spacer" />
        <a href="/about" data-l10n-id="eolNoticeLink" target="_blank">Learn more</a>
      </Warning>
    );
  }

  render() {
    const { experiment, experiments, installed, isAfterCompletedDate, isDev,
            hasAddon, setExperimentLastSeen, clientUUID,
            setPageTitleL10N } = this.props;

    // Show the loading animation if experiments haven't been loaded yet.
    if (experiments.length === 0) { return <LoadingPage />; }

    // Show a 404 page if an experiment for this slug wasn't found.
    if (!experiment) { return <NotFoundPage />; }

    setPageTitleL10N('pageTitleExperiment', experiment);

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

    const { title, contribute_url, bug_report_url, discourse_url, privacy_preamble,
            introduction, measurements, privacy_notice_url, changelog_url,
            thumbnail, subtitle, survey_url, contributors, contributors_extra, contributors_extra_url, details,
            min_release, graduation_report } = experiment;

    // Set the timestamp for when this experiment was last seen (for
    // ExperimentRowCard updated/launched banner logic)
    setExperimentLastSeen(experiment);

    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
    const graduated = isAfterCompletedDate(experiment);
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));

    let statusType = null;
    if (experiment.error) {
      statusType = 'error';
    } else if (enabled) {
      statusType = 'enabled';
    }

    return (
      <section id="experiment-page">

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
              this.uninstallExperiment(e);
            }} />}

        <View {...this.props}>

        {!hasAddon && <section id="testpilot-promo">
          <div className="experiment-promo">
            <div className="reverse-split-banner responsive-content-wrapper">
              <div className="copter-wrapper fly-up">
                <div className="copter"></div>
              </div>
              <div className="intro-text">
                <h2 className="banner">
                  <span data-l10n-id="experimentPromoHeader" className="block">Ready for Takeoff?</span>
                </h2>
                <p data-l10n-id="experimentPromoSubheader"></p>
                <MainInstallButton {...this.props}
                                   experimentTitle={title}
                                   installCallback={ this.installExperiment.bind(this) } />
              </div>
            </div>
          </div>
        </section>}

        <div className="default-background">
          <div className={classnames(
              'details-header-wrapper',
              { 'has-status': !!statusType, stick: useStickyHeader })
            }>
            <div className={classnames('status-bar', statusType)}>
              {(statusType === 'enabled') && <span data-l10n-id="isEnabledStatusMessage" data-l10n-args={JSON.stringify({ title })}><span></span></span>}
              {(statusType === 'error') && <span data-l10n-id="installErrorMessage" data-l10n-args={JSON.stringify({ title })}><span></span></span>}
            </div>
            <div className="details-header responsive-content-wrapper">
              <header>
                <h1>{title}</h1>
                {subtitle && <h4 className="subtitle" data-l10n-id={this.l10nId('subtitle')}>{subtitle}</h4>}
              </header>
              { this.renderExperimentControls() }
              { this.renderMinimumVersionNotice(title, hasAddon, min_release) }
            </div>
          </div>
          <div className="sticky-header-sibling" style={{ height: `${stickyHeaderSiblingHeight}px` }} ></div>

          <div id="details">
              <div className="details-content responsive-content-wrapper">
                <div className="details-overview">
                  <div className="experiment-icon-wrapper"
                       style={{
                         backgroundColor: `${experiment.gradient_start}`,
                         backgroundImage: `linear-gradient(135deg, ${experiment.gradient_start}, ${experiment.gradient_stop})`
                       }}>
                    <img className="experiment-icon" src={thumbnail}></img>
                  </div>
                  <div className="details-sections">
                    <section className="user-count">
                      { this.renderInstallationCount() }
                    </section>
                    {!hasAddon && <div>
                      {!!introduction && <section className="introduction">
                      {!graduated &&
                        <div data-l10n-id={this.l10nId('introduction')} dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                      }
                      </section>}
                    </div>}
                    {!graduated && <div>
                      <section className="stats-section">
                        <table className="stats"><tbody>
                          {hasAddon && <tr>
                            <td data-l10n-id="tour">Tour</td>
                            <td><a className="showTour" data-l10n-id="tourLink" onClick={e => this.showTour(e)} href="#">Launch Tour</a></td>
                          </tr>}
                          {changelog_url && <tr>
                            <td data-l10n-id="changelog">Changelog</td>
                            <td>
                             {changelog_url && <a href={changelog_url}>{changelog_url}</a>}
                            </td>
                          </tr>}
                          <tr>
                            <td data-l10n-id="contribute">Contribute</td>
                            <td><a href={contribute_url}>{contribute_url}</a></td>
                          </tr>

                          <tr>
                            <td data-l10n-id="bugReports">Bug Reports</td>
                            <td><a href={bug_report_url}>{bug_report_url}</a></td>
                          </tr>

                          <tr>
                            <td data-l10n-id="discussExperiment" data-l10n-args={JSON.stringify({ title })}></td>
                            <td><a href={discourse_url}>{discourse_url}</a></td>
                          </tr>
                        </tbody></table>
                      </section>
                    </div>}
                    <section className="contributors-section">
                      <h3 data-l10n-id="contributorsHeading">Brought to you by</h3>
                      <ul className="contributors">
                        {contributors.map((contributor, idx) => (
                          <li key={idx}>
                            <img className="avatar" width="56" height="56" src={contributor.avatar} />
                            <div className="contributor">
                              <p className="name">{contributor.display_name}</p>
                              {contributor.title && <p className="title" data-l10n-id={this.l10nId(['contributors', idx, 'title'])}>{contributor.title}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    {contributors_extra && <p className="disclaimer">
                        <span data-l10n-id={this.l10nId('contributors_extra')}>{contributors_extra}</span>
                        {contributors_extra_url && <span>&nbsp;
                          <a data-l10n-id="contributorsExtraLearnMore" href={contributors_extra_url} target="_blank">Learn more</a>.</span>
                        }
                      </p>
                    }
                    </section>
                    {!graduated && <div>
                      <div>
                        {measurements && <section
                              className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                          <h3 data-l10n-id="measurements">Your privacy</h3>
                          <div data-hook="measurements-html" className="measurement">
                            {privacy_preamble && <p data-l10n-id={this.l10nId('privacy_preamble')}>{privacy_preamble}</p>}
                            <p data-l10n-id="experimentMeasurementIntro"
                               data-l10n-args={JSON.stringify({ experimentTitle: experiment.title })}>
                              In addition to the <a href="/privacy">data</a> collected by all Test Pilot experiments, here are the
                              key things you should know about what is happening when you use {experiment.title}:
                            </p>
                            <ul>
                              {measurements.map((note, idx) => (
                                <li data-l10n-id={this.l10nId(['measurements', idx])}>{note}</li>
                              ))}
                            </ul>
                          </div>
                          {privacy_notice_url && <a className="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-l10n-args={JSON.stringify({ title })} href={privacy_notice_url}><span></span></a>}
                        </section>}
                      </div>
                    </div>}
                  </div>
                </div>
                {!graduated &&
                  <div className="details-description">
                  {this.renderEolBlock()}
                  {this.renderIncompatibleAddons()}
                  {this.renderLocaleWarning()}
                  {hasAddon && <div>
                    {!!introduction && <section className="introduction">
                      <div data-l10n-id={this.l10nId('description')} dangerouslySetInnerHTML={createMarkup(introduction)}></div>
                    </section>}
                  </div>}
                  <div className="details-list">
                    {details.map((detail, idx) => (
                     <div key={idx}>
                       <div className="details-image">
                         <img width="680" src={detail.image} />
                         <p className="caption">
                           {detail.headline && <strong data-l10n-id={this.l10nId(['details', idx, 'headline'])}>{detail.headline}</strong>}
                           {detail.copy && <span data-l10n-id={this.l10nId(['details', idx, 'copy'])} dangerouslySetInnerHTML={createMarkup(detail.copy)}></span>}
                         </p>
                       </div>
                     </div>
                    ))}
                  </div>
                  {hasAddon && <div>
                    {measurements && <section
                          className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                      <h3 data-l10n-id="measurements">Your privacy</h3>
                      <div data-hook="measurements-html" className="measurement">
                        {privacy_preamble && <p data-l10n-id={this.l10nId('privacy_preamble')}>{privacy_preamble}</p>}
                        <p data-l10n-id="experimentMeasurementIntro"
                           data-l10n-args={JSON.stringify({ experimentTitle: experiment.title })}>
                          In addition to the <a href="/privacy">data</a> collected by all Test Pilot experiments, here are the
                          key things you should know about what is happening when you use {experiment.title}:
                        </p>
                        <ul>
                          {measurements.map((note, idx) => (
                            <li data-l10n-id={this.l10nId(['measurements', idx])}>{note}</li>
                          ))}
                        </ul>
                      </div>
                      {privacy_notice_url && <a className="privacy-policy" data-l10n-id="experimentPrivacyNotice" data-l10n-args={JSON.stringify({ title })} href={privacy_notice_url}><span data-hook="title"></span></a>}
                    </section>}
                  </div>}
                  </div>}
                {graduated &&
                  <div className="details-description">
                    <section className="graduation-report" dangerouslySetInnerHTML={createMarkup(graduation_report)}/>
                  </div>}
              </div>
            </div>
          </div>
          {!hasAddon && <div>
            <h2 className="card-list-header" data-l10n-id="otherExperiments">Try out these experiments as well</h2>
            <div className="responsive-content-wrapper delayed-fade-in">
              <ExperimentCardList {...this.props}
                                  experiments={currentExperiments}
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
        <span data-l10n-id="completedDateLabel" data-l10n-args={JSON.stringify({ completedDate })}><b></b></span>
      );
    }
    if (!installation_count || installation_count <= 100) {
      return (
        <span data-l10n-id="userCountContainerAlt" className="bold" data-l10n-args={JSON.stringify({ title })}></span>
      );
    }
    return (
      // Note: this doesn't include the text content because of a conflict
      // in how l20n and react modify the dom.
      // https://github.com/mozilla/testpilot/pull/1712
      <span data-l10n-id="userCountContainer" data-l10n-args={JSON.stringify({ installation_count: installation_count, title })}><span className="bold"></span></span>
    );
  }

  renderMinimumVersionNotice(title, hasAddon, min_release) {
    if (hasAddon && !this.isValidVersion(min_release)) {
      return (
        <div className="upgrade-notice">
          <div data-l10n-id="upgradeNoticeTitle" data-l10n-args={JSON.stringify({ title, min_release })}></div>
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
            <button onClick={e => { e.preventDefault(); this.setState({ showEolDialog: true }); }} style={{ minWidth: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'warning'], { 'state-change': isDisabling })}><span className="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" className="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text"></span></button>
          </div>
        );
      }
      return null;
    }
    if (enabled) {
      return (
        <div className="experiment-controls">
          <a onClick={e => this.handleFeedback(e)} data-l10n-id="giveFeedback" id="feedback-button" className="button default" href={surveyURL}>Give Feedback</a>
          <button onClick={e => this.renderUninstallSurvey(e)} style={{ minWidth: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'secondary'], { 'state-change': isDisabling })}><span className="state-change-inner"></span><span data-l10n-id="disableExperimentTransition" className="transition-text">Disabling...</span><span data-l10n-id="disableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text"></span></button>
        </div>
      );
    }
    return (
      <div className="experiment-controls">
        <a onClick={e => this.highlightPrivacy(e)} className="highlight-privacy" data-l10n-id="highlightPrivacy">Your privacy</a>
        <button onClick={e => this.installExperiment(e)} style={{ minWidth: progressButtonWidth }} id="install-button"  className={classnames(['button', 'default'], { 'state-change': isEnabling })}><span className="state-change-inner"></span><span data-l10n-id="enableExperimentTransition" className="transition-text">Enabling...</span><span data-l10n-id="enableExperiment" data-l10n-args={JSON.stringify({ title })} className="default-text"></span></button>
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
    const { experiment } = this.props;
    this.setState({
      showPreFeedbackDialog: true
    });

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
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

    let installAddonPromise = null;
    if (!this.props.hasAddon) {
      const { installAddon, requireRestart } = this.props;
      const eventCategory = 'ExperimentDetailsPage Interactions';
      const eventLabel = `Install the Add-on from ${experiment.title}`;
      installAddonPromise = installAddon(
        requireRestart,
        sendToGA,
        eventCategory,
        eventLabel);
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

    installAddonPromise.then(() => {
      return new Promise((resolve, reject) => {
        let i = 0;
        const interval = setInterval(() => {
          i++;
          if (this.props.hasAddon) {
            clearInterval(interval);
            resolve();
          } else if (i > 100) {
            clearInterval(interval);
            reject(new Error('window.navigator.testpilotAddon still undefined after 10 seconds'));
          }
        }, 100);
      });
    }).then(finishEnabling);
  }

  uninstallExperiment(evt) {
    const { experiment, disableExperiment } = this.props;
    const { isDisabling } = this.state;

    evt.preventDefault();

    // Ignore subsequen clicks if already in progress
    if (isDisabling) { return; }

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
  }

  renderUninstallSurvey(evt) {
    evt.preventDefault();

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
