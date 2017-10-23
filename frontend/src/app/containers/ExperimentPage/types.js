import type {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from '../../containers/types';

export type ExperimentPropsFromApp = {
  isExperimentEnabled: Function,
  getCookie: Function,
  removeCookie: Function,
  hasAddon: boolean,
  userAgent: string,
  experiments: Array<Object>,
  installed: Object,
  isAfterCompletedDate: Function,
  isDev: boolean,
  setExperimentLastSeen: Function,
  clientUUID: string,
  installedAddons: Object,
  setPageTitleL10N: Function,
  locale: string,
  getElementOffsetHeight: Function,
  getElementY: Function,
  setScrollY: Function,
  getScrollY: Function,
  sendToGA: Function,
  addScrollListener: Function,
  removeScrollListener: Function,
  disableExperiment: Function
};

export type ExperimentPageProps = ExperimentPropsFromApp & {
  getExperimentBySlug: Function,
  slug: string
};

export type ExperimentDetailProps = ExperimentPropsFromApp & {
  experiment: Object
};

// HACK: Not sure why, but MouseEvent target is missing offsetWidth
// https://github.com/facebook/flow/blob/v0.57.3/lib/dom.js#L154
export type MouseEventWithElementTarget = {
  preventDefault: Function,
  target: {
    offsetWidth: number
  }
};

export type IncompatibleAddonsProps = {
  experiment: Object,
  installedAddons: Array<string>
};

export type TestpilotPromoProps = {
  hasAddon: any,
  graduated: boolean,
  experiment: Object,
  installCallback: Function
} & MiscAppProps & SendToGAProps & BrowserEnvProps;

export type DetailsHeaderProps = {
  hasAddon: any,
  userAgent: string,
  experiment: Object,
  installed: Object,
  enabled: boolean,
  progressButtonWidth: string,
  isDisabling: boolean,
  isEnabling: boolean,
  surveyURL: string,
  installExperiment: Function,
  uninstallExperimentWithSurvey: Function,
  getElementOffsetHeight: Function,
  getElementY: Function,
  setScrollY: Function,
  getScrollY: Function,
  l10nId: Function,
  addScrollListener: Function,
  removeScrollListener: Function,
  flashMeasurementPanel: Function,
  sendToGA: Function,
  doShowEolDialog: Function
};

export type ExperimentControlsType = {
  hasAddon: any,
  userAgent: string,
  experiment: Object,
  installed: Object,
  graduated: boolean,
  surveyURL: string,
  enabled: boolean,
  progressButtonWidth: number,
  installExperiment: Function,
  uninstallExperimentWithSurvey: Function,
  isEnabling: boolean,
  isDisabling: boolean,
  doShowEolDialog: Function,
  doShowPreFeedbackDialog: Function,
  sendToGA: Function,
  highlightPrivacy: Function
};

export type WebExperimentControlsType = {
  web_url: string,
  title: string,
  sendToGA: Function
};

export type EnableButtonType = {
  experiment: Object,
  installExperiment: Function,
  isEnabling: boolean,
  progressButtonWidth: number,
  sendToGA: Function
};

export type MinimumVersionNoticeType = {
  userAgent: string,
  title: string,
  hasAddon: any,
  min_release: string,
  sendToGA: Function
};

export type MaximumVersionNoticeType = {
  userAgent: string,
  title: string,
  hasAddon: any,
  max_release: string,
  graduated: boolean,
  sendToGA: Function
};

export type DetailsDescriptionProps = {
  experiment: Object,
  graduated: boolean,
  locale: string,
  hasAddon: any,
  installedAddons: Object,
  highlightMeasurementPanel: Function
};

export type LocaleWarningType = {
  experiment: Object,
  locale: string,
  hasAddon: any
};

export type EolBlockProps = {
  experiment: Object,
  l10nId: Function
};

export type DetailsOverviewType = {
  experiment: Object,
  graduated: boolean,
  highlightMeasurementPanel: boolean,
  doShowTourDialog: Function
};

export type LaunchStatusType = {
  experiment: Object,
  graduated: boolean
};

export type StatsSectionType = {
  experiment: Object,
  doShowTourDialog: Function
};

export type ContributorsSectionType = {
  experiment: Object,
  l10nId: Function
};

export type MeasurementsSectionType = {
  experiment: Object,
  highlightMeasurementPanel: boolean,
  l10nId: Function
};
