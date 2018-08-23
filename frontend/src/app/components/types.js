// @flow
import type { InstalledExperiments } from "../reducers/addon"; // eslint-disable-line no-unused-vars

import type {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from "../containers/types";

export type VariantTestsProps = {
  varianttests: Object
};

export type MainInstallButtonProps = {
  isFeatured?: boolean,
  installed: InstalledExperiments,
  experiment?: Object,
  experimentTitle?: string,
  experimentLegalLink?: any,
  isExperimentEnabled: Function,
  enableExperiment: Function,
  installAddon: Function,
  varianttests?: Object
} & MiscAppProps & SendToGAProps & BrowserEnvProps;
