export type BrowserEnvProps = {
  isFirefox: boolean,
  isMinFirefox: boolean,
  isMobile: boolean,
  hasAddon: any
};

export type SendToGAProps = {
  sendToGA: Function,
  eventCategory: string,
  eventLabel: string
};

// TODO: Reorg this vague grab-bag into more descriptive types
export type MiscAppProps = {
  installAddon: Function
};
