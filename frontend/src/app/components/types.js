import {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from "../containers/types";

export type VariantTestsProps = {
  varianttests: Object
};

export type MainInstallButtonProps = {
  experiment?: Object,
  experimentTitle: string,
  installCallback?: Function,
} & VariantTestsProps & MiscAppProps & SendToGAProps & BrowserEnvProps;
