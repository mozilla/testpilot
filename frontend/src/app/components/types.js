import type { InstalledExperiments } from "../reducers/addon"; // eslint-disable-line no-unused-vars

import {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from "../containers/types";

export type VariantTestsProps = {
  varianttests: Object
};

export type MainInstallButtonProps = {
  isFeatured?: boolean,
  installed: InstallExperiments,
  experiment?: Object,
  experimentTitle: string,
  installCallback?: Function,
} & VariantTestsProps & MiscAppProps & SendToGAProps & BrowserEnvProps;
