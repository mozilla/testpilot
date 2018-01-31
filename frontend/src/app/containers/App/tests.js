/* global describe, it */
import { expect } from "chai";
import { BREAKPOINTS, getBreakpoint, shouldShowUpgradeWarning } from "./index";

describe("app/containers/App", () => {
  it("should not show Upgrade warning if hasAddon is null", () => {
    const hasAddon = null;
    expect(shouldShowUpgradeWarning(hasAddon)).to.be.false;
  });

  it("should not show Upgrade warning if hasAddonManager is true", () => {
    const hasAddon = true;
    const hasAddonManager = true;
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager)).to.be.false;
  });

  it("should not show Upgrade warning if is not firefox", () => {
    const hasAddon = true;
    const hasAddonManager = false;
    const isFirefox = false;
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox)).to.be.false;
  });

  it("should not show upgrade warning if hasAddonManager is false, and host is in approved hosts", () => {
    const hasAddon = true;
    const hasAddonManager = false;
    const isFirefox = false;
    const host = "testpilot-l10n.dev.mozaws.net";
    expect(shouldShowUpgradeWarning(hasAddon, hasAddonManager, isFirefox, host)).to.be.false;
  });
});

describe("app/containers/App:getBreakpoint", () => {
  it("should return 'big' at big screen sizes", () => {
    expect(getBreakpoint(1200)).to.equal(BREAKPOINTS.BIG);
  });

  it("should return 'medium' at medium screen sizes", () => {
    expect(getBreakpoint(800)).to.equal(BREAKPOINTS.MEDIUM);
  });

  it("should return 'small' at small screen sizes", () => {
    expect(getBreakpoint(640)).to.equal(BREAKPOINTS.SMALL);
  });

  it("should return 'mobile' at mobile screen sizes", () => {
    expect(getBreakpoint(360)).to.equal(BREAKPOINTS.MOBILE);
  });
});
