import type {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from "../../containers/types";

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
  removeCookie: Function,
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
  experiment: Object
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
  doShowEolDialog: Function,
  doShowMobileAppDialog: Function,
  doShowPreFeedbackDialog: Function,
  enabled: boolean,
  experiment: Object,
  flashMeasurementPanel: Function,
  graduated: boolean,
  hasAddon: any,
  installExperiment: Function,
  isDisabling: boolean,
  isEnabling: boolean,
  isMinFirefox: Function,
  sendToGA: Function,
  surveyURL: string,
  uninstallExperimentWithSurvey: Function,
  userAgent: string,
};

export type CreateButtonsType = {
  doShowEolDialog: Function,
  doShowMobileAppDialog: Function,
  doShowPreFeedbackDialog: Function,
  enabled: boolean,
  experiment: Object,
  graduated: boolean,
  hasAddon: boolean,
  installExperiment: Function,
  isDisabling: boolean,
  isEnabling: boolean,
  isMinFirefox: Function,
  pre_feedback_copy: string,
  sendToGA: Function,
  surveyURL: string,
  uninstallExperimentWithSurvey: Function,
  userAgent: string,
  validVersion: boolean
};

export type FeedbackButtonType = {
  title: string,
  slug: string,
  surveyUrl: string,
  pre_feedback_copy: string,
  sendToGA: Function,
  color: string,
};

export type MobileTriggerButtonType = {
  doShowMobileAppDialog: Function,
  optionalClass?: string,
  color: string
};

export type GraduatedButtonType = {
  doShowEolDialog: Function,
  isDisabling: boolean,
  title: DOMStringList
};

export type UninstallButtonType = {
  uninstallExperimentWithSurvey: Function,
  isDisabling: boolean,
  title: string
};

export type InstallTestPilotButtonType = {
  installExperiment: Function,
  isEnabling: boolean,
  title: string
};

export type EnableExperimentButtonType = {
  installExperiment: Function,
  isEnabling: boolean,
  title: string,
  color: string
};

export type MobileStoreButtonType = {
  url: string,
  platform: string
};

export type WebExperimentButtonType = {
  color: string,
  sendToGA: Function,
  slug: string,
  title: string,
  web_url: string
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
  doShowTourDialog: Function,
  sendToGA: Function
};

export type LaunchStatusType = {
  experiment: Object,
  graduated: boolean
};

export type StatsSectionType = {
  experiment: Object,
  doShowTourDialog: Function,
  sendToGA: Function
};

export type ContributorsSectionType = {
  experiment: Object,
  l10nId: Function
};
