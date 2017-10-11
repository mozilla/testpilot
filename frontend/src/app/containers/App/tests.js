/* global describe, it */
import { expect } from 'chai';
import { shouldShowUpgradeWarning } from './index';

describe('app/containers/App', () => {
  it('should not show Upgrade warning if hasAddon is null', () => {
    const hasAddon = null;
    expect(shouldShowUpgradeWarning(hasAddon)).to.be.false;
  });

  it('should not show Upgrade warning if hasAddonManager is true', () => {
    const hasAddon = true;
    const hasAddonManager = true;
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager)).to.be.false;
  });

  it('should not show Upgrade warning if is not firefox', () => {
    const hasAddon = true;
    const hasAddonManager = false;
    const isFirefox = false;
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox)).to.be.false;
  });

  it('should not show upgrade warning if hasAddonManager is false, and host is in approved hosts', () => {
    const hasAddon = true;
    const hasAddonManager = false;
    const isFirefox = false;
    const host = 'testpilot-l10n.dev.mozaws.net';
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox, host)).to.be.false;
  });
});
