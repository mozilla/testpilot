// @flow
export function hasAddonSelector(store: { addon: { hasAddon: boolean }}): boolean {
  return !!store.addon.hasAddon;
}
