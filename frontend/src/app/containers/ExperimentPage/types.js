// @flow
import type {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from "../../containers/types";

import type {
  MainInstallButtonProps
} from "../../components/types";

export type ExperimentPropsFromApp = {
  countryCode: null | string,
  isExperimentEnabled: Function,
  getCookie: Function,
  removeCookie: Function,
  hasAddon: boolean,
  userAgent: string,
  experiments: Array<Object>,
  installed: Object,
  installAddon: Function,
  isMobile: boolean,
  isAfterCompletedDate: Function,
  isDev: boolean,
  fetchCountryCode: Function,
  clientUUID: string,
  installedAddons: Array<Object>,
  setPageTitleL10N: Function,
  locale: string,
  getElementOffsetHeight: Function,
  getElementY: Function,
  getWindowLocation: Function,
  setScrollY: Function,
  getScrollY: Function,
  installed: Object,
  installExperiment: Function,
  isFirefox: boolean,
  isMinFirefox: boolean,
  enabled: boolean,
  sendToGA: Function,
  isEnabling: boolean,
  isDisabling: boolean,
  addScrollListener: Function,
  removeScrollListener: Function,
  disableExperiment: Function,
  enableExperiment: Function
};

export type ExperimentPageProps = ExperimentPropsFromApp & {
  removeCookie: Function,
  getExperimentBySlug: Function,
  slug: string
};

export type ExperimentDetailState = {
  enabled: boolean,
  highlightMeasurementPanel: boolean,
  isEnabling: boolean,
  isDisabling: boolean,
  showEmailDialog: boolean,
  showDisableDialog: boolean,
  showTourDialog: boolean,
  showMobileDialog: boolean,
  showPreFeedbackDialog: boolean,
  showEolDialog: boolean
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
  installedAddons: Array<Object>
};

export type TestpilotPromoProps = {
  hasAddon: any,
  graduated: boolean,
  experiment: Object
} & MainInstallButtonProps & MiscAppProps & SendToGAProps & BrowserEnvProps;

export type DetailsHeaderProps = {
  hasAddon: any,
  userAgent: string,
  experiment: Object,
  installed: Object,
  enabled: boolean,
  graduated: boolean,
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
  isMinFirefox: boolean,
  pre_feedback_copy: string,
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
  isMinFirefox: boolean,
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
  surveyURL: string,
  pre_feedback_copy: string,
  doShowPreFeedbackDialog: Function,
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
  title: string
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
  category: string,
  platform: string,
  sendToGA: Function,
  slug: string
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
  slug: string,
  hasAddon: any,
  min_release: number,
  sendToGA: Function
};

export type MaximumVersionNoticeType = {
  userAgent: string,
  title: string,
  hasAddon: any,
  slug: string,
  max_release: number,
  graduated: boolean,
  sendToGA: Function
};

export type DetailsDescriptionProps = {
  experiment: Object,
  graduated: boolean,
  locale: string,
  hasAddon: any,
  installedAddons: Array<Object>,
  highlightMeasurementPanel: boolean
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
  userAgent: string,
  hasAddon: boolean,
  enabled: boolean,
  isEnabling: boolean,
  isDisabling: boolean,
  installExperiment: Function,
  isMinFirefox: boolean,
  highlightMeasurementPanel: boolean,
  uninstallExperimentWithSurvey: Function,
  flashMeasurementPanel: Function,
  doShowMobileAppDialog: Function,
  doShowPreFeedbackDialog: Function,
  doShowEolDialog: Function,
  doShowTourDialog: Function,
  pre_feedback_copy: string,
  sendToGA: Function,
  surveyURL: string,
  hasTour: boolean
};

export type LaunchStatusType = {
  experiment: Object,
  graduated: boolean
};

export type StatsSectionType = {
  experiment: Object,
  doShowTourDialog: Function,
  flashMeasurementPanel: Function,
  sendToGA: Function,
  hasTour: boolean,
  isMinFirefox: boolean
};

export type ContributorsSectionType = {
  experiment: Object,
  l10nId: Function
};
