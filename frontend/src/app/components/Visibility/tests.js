/* global describe, beforeEach, afterEach, it */

import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";

import Visibility from "./index";

describe("app/components/Visibility", () => {
  const expectVisibility = (subject, visible) => {
    expect(subject.find(".isvisible").length).to.equal(visible ? 1 : 0);
    expect(subject.find(".notvisible").length).to.equal(visible ? 0 : 1);
  };

  it("should have a class name reflecting initial visibility prop value", () => {
    const subject = mount(<Visibility isVisible={true} />);
    expectVisibility(subject, true);
    subject.unmount();
  });

  it("should have a class name reflecting initial non-visible prop value", () => {
    const subject = mount(<Visibility isVisible={false} />);
    expectVisibility(subject, false);
    subject.unmount();
  });

  describe("scrolling", () => {
    let subject, rect, listener, innerHeight, addEventListener, requestAnimationFrame;

    beforeEach(() => {
      innerHeight = 1000;
      requestAnimationFrame = fn => fn();
      addEventListener = sinon.spy((name, fn) => {
        if (name === "scroll") {
          listener = fn;
        }
      });

      Object.assign(global.window, {
        innerHeight,
        addEventListener,
        requestAnimationFrame
      });

      subject = mount(<Visibility />);
      expect(listener).to.not.be.undefined;
      rect = { y: innerHeight + 500 };

      // HACK: monkeypatch a mock into the subject
      subject.instance().elementRef.getBoundingClientRect = () => rect;
    });

    afterEach(() => {
      subject.unmount();
    });

    const setY = y => {
      rect.y = y;
      listener();
      subject.update();
    };

    it("should change classname on becoming visible", () => {
      setY(innerHeight + 500);
      expectVisibility(subject, false);
      setY(innerHeight - 500);
      expectVisibility(subject, true);
    });

    it("should change classname on becoming invisible", () => {
      setY(innerHeight - 500);
      expectVisibility(subject, true);
      setY(innerHeight + 500);
      expectVisibility(subject, false);
    });
  });
});
