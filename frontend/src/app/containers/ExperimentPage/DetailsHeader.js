// @flow

import React from 'react';
import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import LayoutWrapper from '../../components/LayoutWrapper';
import { experimentL10nId } from '../../lib/utils';

import type {
  DetailsHeaderProps,
  ExperimentControlsType,
  WebExperimentControlsType,
  EnableButtonType,
  MinimumVersionNoticeType,
  MaximumVersionNoticeType
} from './types';

type DetailsHeaderState = {
  useStickyHeader: boolean,
  stickyHeaderSiblingHeight: number,
  changeHeaderOn: number
};

export const PRIVACY_SCROLL_OFFSET = 15;

export default class DetailsHeader extends React.Component {
  props: DetailsHeaderProps;
  state: DetailsHeaderState;
  didScroll: boolean;
  scrollListener: Function;

  constructor(props: DetailsHeaderProps) {
    super(props);

    this.state = {
      useStickyHeader: false,
      stickyHeaderSiblingHeight: 0,
      changeHeaderOn: 125
    };

    // HACK: Set this as a plain object property, so we don't trigger crazy
    // state changes on scrolling events.
    this.didScroll = false;
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

  render() {
    const { highlightPrivacy, l10nId } = this;

    const {
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
      uninstallExperimentWithSurvey
    } = this.props;

    const { useStickyHeader, stickyHeaderSiblingHeight } = this.state;

    const { title, subtitle, error, min_release, max_release } = experiment;

    let statusType = null;
    if (error) {
      statusType = 'error';
    } else if (enabled) {
      statusType = 'enabled';
    }

    const hasStatus =
      !!statusType &&
      !(
        installed[experiment.addon_id] &&
        installed[experiment.addon_id].manuallyDisabled
      );

    return (
      <div>
        <div
          key="details-header-wrapper"
          className={classnames('details-header-wrapper', {
            'has-status': hasStatus,
            stick: useStickyHeader
          })}
        >
          <div className={classnames('status-bar', statusType)}>
            {statusType === 'enabled' &&
              <Localized id="isEnabledStatusMessage" $title={title}>
                <span>
                  {title} is enabled.
                </span>
              </Localized>}
            {statusType === 'error' &&
              <Localized id="installErrorMessage" $title={title}>
                <span>
                  Uh oh. {title} could not be enabled. Try again later.
                </span>
              </Localized>}
          </div>
          <LayoutWrapper
            helperClass="details-header"
            flexModifier="row-between-breaking"
          >
            <header>
              <h1>
                {title}
              </h1>
              {subtitle &&
                <Localized id={l10nId('subtitle')}>
                  <h4 className="subtitle">
                    {subtitle}
                  </h4>
                </Localized>}
            </header>
            <ExperimentControls
              {...{
                sendToGA,
                hasAddon,
                userAgent,
                experiment,
                surveyURL,
                installed,
                graduated,
                enabled,
                progressButtonWidth,
                installExperiment,
                isEnabling,
                isDisabling,
                highlightPrivacy,
                doShowEolDialog,
                doShowPreFeedbackDialog,
                uninstallExperimentWithSurvey
              }}
            />
            <MinimumVersionNotice
              {...{ userAgent, title, hasAddon, min_release, sendToGA }}
            />
            <MaximumVersionNotice
              {...{
                userAgent,
                title,
                hasAddon,
                max_release,
                graduated,
                sendToGA
              }}
            />
          </LayoutWrapper>
        </div>
        <div
          key="sticky-header-sibling"
          className="sticky-header-sibling"
          style={{ height: `${stickyHeaderSiblingHeight}px` }}
        />
      </div>
    );
  }

  onScroll() {
    const { getElementOffsetHeight, getScrollY } = this.props;
    const sy = getScrollY();
    const detailsHeaderWrapperHeight = getElementOffsetHeight(
      '.details-header-wrapper'
    );
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const useStickyHeader = sy > changeHeaderOn;
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(
      detailsHeaderWrapperHeight,
      useStickyHeader
    );

    this.setState({
      changeHeaderOn,
      useStickyHeader,
      stickyHeaderSiblingHeight
    });
    this.didScroll = false;
  }

  // if there is no content in the .status-bar
  // adjust the initial snap position and the header isn't yet sticky, adjust
  // changeHeaderOn to the top of the .details-header
  // instead of the bottom of the #main-header
  setChangeHeaderOn(detailsHeaderWrapperHeight: number) {
    const { getElementOffsetHeight, experiment } = this.props;
    const statusBar = experiment.error || this.props.enabled;
    const detailsHeaderHeight = getElementOffsetHeight('.details-header');
    let changeHeaderOn = getElementOffsetHeight('#main-header');

    if (!statusBar) {
      if (this.state.useStickyHeader) {
        changeHeaderOn = this.state.stickyHeaderSiblingHeight;
      } else {
        changeHeaderOn += detailsHeaderWrapperHeight - detailsHeaderHeight;
      }
    }

    return changeHeaderOn;
  }

  // modify the height of the .sticky-header-sibling if useStickyHeader.
  // Since the height of the details header changes height depending on
  // whether there is a visible status, always set the state to whatever
  // is tallest
  setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight: number, useStickyHeader: boolean) {
    let stickyHeaderSiblingHeight = 0;

    if (useStickyHeader) {
      stickyHeaderSiblingHeight = Math.max(
        detailsHeaderWrapperHeight,
        this.state.stickyHeaderSiblingHeight
      );
    }

    return stickyHeaderSiblingHeight;
  }

  l10nId = (pieces: string) => experimentL10nId(this.props.experiment, pieces);

  // scrollOffset lets us scroll to the top of the highlight box shadow animation
  highlightPrivacy = (evt: Event) => {
    const {
      getElementOffsetHeight,
      getElementY,
      setScrollY,
      flashMeasurementPanel
    } = this.props;
    const detailsHeaderWrapperHeight = getElementOffsetHeight(
      '.details-header-wrapper'
    );
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(
      detailsHeaderWrapperHeight,
      true
    );
    evt.preventDefault();
    setScrollY(
      getElementY('.measurements') +
        (stickyHeaderSiblingHeight - PRIVACY_SCROLL_OFFSET)
    );
    this.setState({
      changeHeaderOn,
      stickyHeaderSiblingHeight,
      useStickyHeader: true
    });
    flashMeasurementPanel();
  };
}

function maxVersionCheck(userAgent: string, max: number) {
  const version = parseInt(userAgent.split('/').pop(), 10);
  return typeof max === 'undefined' || version <= max;
}

function minVersionCheck(userAgent: string, min: number) {
  const version = parseInt(userAgent.split('/').pop(), 10);
  return typeof min === 'undefined' || version >= min;
}

function isValidVersion(userAgent: string, min: number, max: number) {
  if (!max) max = Infinity;
  return minVersionCheck(userAgent, min) && maxVersionCheck(userAgent, max);
}

export const ExperimentControls = ({
  hasAddon,
  userAgent,
  experiment,
  installed,
  graduated,
  surveyURL,
  enabled,
  progressButtonWidth,
  installExperiment,
  uninstallExperimentWithSurvey,
  isEnabling,
  isDisabling,
  doShowEolDialog,
  doShowPreFeedbackDialog,
  sendToGA,
  highlightPrivacy
}: ExperimentControlsType) => {
  const {
    title,
    min_release,
    max_release,
    platforms,
    addon_id,
    pre_feedback_copy
  } = experiment;

  const validVersion = isValidVersion(userAgent, min_release, max_release);

  const handleFeedback = evt => {
    if (pre_feedback_copy === null || !pre_feedback_copy) {
      sendToGA('event', {
        eventCategory: 'ExperimentDetailsPage Interactions',
        eventAction: 'Give Feedback',
        eventLabel: title
      });
    } else {
      doShowPreFeedbackDialog(evt);
      sendToGA('event', {
        eventCategory: 'ExperimentDetailsPage Interactions',
        eventAction: 'Give Feedback',
        eventLabel: experiment.title
      });
    }
  };

  if (!hasAddon || !validVersion) {
    const useWebLink = (platforms || []).indexOf('web') !== -1;
    if (!useWebLink) {
      return null;
    }
  }
  if (graduated) {
    if (enabled) {
      return (
        <div className="experiment-controls">
          <button
            onClick={doShowEolDialog}
            style={{ minWidth: progressButtonWidth }}
            id="uninstall-button"
            className={classnames(['button', 'warning'], {
              'state-change': isDisabling
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
    }
    return null;
  }
  if (
    installed &&
    installed[addon_id] &&
    installed[addon_id].manuallyDisabled
  ) {
    return (
      <div className="experiment-controls">
        <button
          disabled
          onClick={e => {
            e.preventDefault();
          }}
          style={{ minWidth: progressButtonWidth }}
          id="install-button"
          className={classnames(['button', 'default'])}
        >
          <Localized id="experimentManuallyDisabled" $title={title}>
            <span className="default-text">
              {title} disabled in Add-ons Manager
            </span>
          </Localized>
        </button>
      </div>
    );
  }
  if (enabled) {
    return (
      <div className="experiment-controls">
        <Localized id="giveFeedback">
          <a
            onClick={handleFeedback}
            id="feedback-button"
            className="button secondary"
            href={surveyURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Give Feedback
          </a>
        </Localized>
        <button
          onClick={uninstallExperimentWithSurvey}
          style={{ minWidth: progressButtonWidth }}
          id="uninstall-button"
          className={classnames(['button', 'secondary'], {
            'state-change': isDisabling
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
  }

  return (
    <div className="experiment-controls">
      <Localized id="highlightPrivacy">
        <a onClick={highlightPrivacy} className="highlight-privacy">
          Your privacy
        </a>
      </Localized>
      <EnableButton
        {...{
          experiment,
          installExperiment,
          isEnabling,
          progressButtonWidth,
          sendToGA
        }}
      />
    </div>
  );
};

export const MinimumVersionNotice = ({
  userAgent,
  title,
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
              sendToGA('event', {
                eventCategory: 'ExperimentDetailsPage Interactions',
                eventAction: 'Upgrade Notice',
                eventLabel: title
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
              sendToGA('event', {
                eventCategory: 'ExperimentDetailsPage Interactions',
                eventAction: 'Upgrade Notice',
                eventLabel: title
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

export const WebExperimentControls = ({
  web_url,
  title,
  sendToGA
}: WebExperimentControlsType) => {
  function handleGoToLink() {
    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Enable Experiment',
      eventLabel: title
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
  experiment: { title, web_url, platforms },
  installExperiment,
  isEnabling,
  progressButtonWidth,
  sendToGA
}: EnableButtonType) => {
  const useWebLink = (platforms || []).indexOf('web') !== -1;
  if (useWebLink) {
    return <WebExperimentControls {...{ web_url, title, sendToGA }} />;
  }

  return (
    <button
      onClick={installExperiment}
      style={{ minWidth: progressButtonWidth }}
      id="install-button"
      className={classnames(['button', 'default'], {
        'state-change': isEnabling
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
