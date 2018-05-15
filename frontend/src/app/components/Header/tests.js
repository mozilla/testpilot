/* global describe, beforeEach, it */

import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "chai";
import sinon from "sinon";
import { mount } from "enzyme";
import { findLocalizedById } from "../../../../test/app/util";

import Header from "./index";

const enzymeOptions = {
  context: {
    router: new MemoryRouter()
  },
  childContextTypes: {
    router: sinon.spy()
  }
};

describe("Header", () => {
  let preventDefault, stopPropagation, mockClickEvent, props, subject, target;
  beforeEach(() => {
    preventDefault = sinon.spy();
    stopPropagation = sinon.spy();
    target = { href: "/" };
    mockClickEvent = { preventDefault, stopPropagation, target };
    props = {
      uninstallAddon: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy()
    };
    subject = mount(<Header {...props} />, enzymeOptions);
  });

  const expectMenuGA = (label, action = "drop-down menu") => {
    expect(props.sendToGA.lastCall.args).to.deep.equal(["event", {
      eventCategory: "Menu Interactions",
      eventAction: action,
      eventLabel: label
    }]);
  };

  describe("with hasAddon default", () => {
    it("should render default expected content", () => {
      expect(subject.find("#main-header")).to.have.property("length", 1);
    });
    it("should not show the settings button", () => {
      expect(subject.find(".settings-button")).to.have.property("length", 0);
    });
    it("should link to /", () => {
      expect(subject.find("a.wordmark").props()).to.have.property("href", target.href);
    });
    it("should ping GA when wordmark is clicked", () => {
      subject.find("a.wordmark").simulate("click", mockClickEvent);
      expect(props.sendToGA.lastCall.args.slice(0, 2)).to.deep.equal(["event", {
        eventCategory: "Menu Interactions",
        eventAction: "click",
        eventLabel: "Firefox logo"
      }]);
    });
  });

  describe("with hasAddon=true", () => {
    beforeEach(() => {
      subject.setProps({ hasAddon: true });
    });

    it("should show the settings button", () => {
      expect(subject.find(".settings-button")).to.have.property("length", 1);
    });

    it("should show a link to the blog", () => {
      expect(subject.find(".blog-link")).to.have.property("length", 1);
    });

    it("should ping GA on blog link clicked", () => {
      subject.find(".blog-link").simulate("click", mockClickEvent);
      expect(props.sendToGA.lastCall.args.slice(0, 2)).to.deep.equal(["event", {
        eventCategory: "Menu Interactions",
        eventAction: "click",
        eventLabel: "open blog",
        outboundURL: mockClickEvent.target.href
      }]);
    });

    it("should show the settings menu when the settings button is clicked", () => {
      subject.find(".settings-button").simulate("click", mockClickEvent);
      expect(subject.state("showSettings")).to.be.true;
      expect(subject.find(".settings-contain")).to.have.property("length", 1);
      expectMenuGA("Toggle Menu");
    });

    it("should link to /experiments", () => {
      expect(subject.find("a.wordmark").props()).to.have.property("href", "/experiments");
    });

    describe("and showSettings=true", () => {
      beforeEach(() => {
        subject.setState({ showSettings: true });
      });

      const clickItem = name => {
        findLocalizedById(subject, name)
          .find("a")
          .simulate("click", mockClickEvent);
      };

      it("should ping GA and and close menu on discuss clicks", () => {
        clickItem("menuDiscuss");
        expectMenuGA("Discuss");
      });

      it("should ping GA and close menu on wiki clicks", () => {
        clickItem("menuWiki");
        expectMenuGA("wiki");
      });

      it("should ping GA and close menu on file issue click", () => {
        clickItem("menuFileIssue");
        expectMenuGA("file issue");
      });
    });
  });
});
