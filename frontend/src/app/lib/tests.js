/* global describe, beforeEach, it */
import { expect } from "chai";

import { shouldOpenInNewTab } from "./utils";

describe("app/lib/utils:shouldOpenInNewTab", () => {
  let mockClickEvent;
  beforeEach(() => {
    mockClickEvent = {
      ctrlKey: false,
      metaKey: false,
      type: "click",
      which: 1
    };
  });

  it("should default to false", () => {
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.false;
  });

  it("should return true when ctrl-clicked", () => {
    mockClickEvent.ctrlKey = true;
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.true;
  });

  it("should return true when cmd-clicked", () => {
    mockClickEvent.metaKey = true;
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.true;
  });

  it("should return false for non-click events", () => {
    mockClickEvent.type = "keypress";
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.false;
  });

  it("should return true for middle clicks", () => {
    mockClickEvent.which = 2;
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.true;
  });

  it("should return false for right clicks", () => {
    mockClickEvent.which = 3;
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.false;
  });

  it("should return true for side clicks", () => {
    mockClickEvent.which = 4;
    expect(shouldOpenInNewTab(mockClickEvent)).to.be.true;
  });
});
