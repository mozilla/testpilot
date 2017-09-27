import type {
  MiscAppProps,
  BrowserEnvProps,
  SendToGAProps
} from '../../containers/types';

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
