/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */

import PubSub from "pubsub-js";
import allTopics from "./topics";

import { log } from "./utils";

const { utils: Cu } = Components;
Cu.import("resource://gre/modules/Services.jsm");
const { addObserver, removeObserver, notifyObservers } = Services.obs;

const eventsTopics = (...args) => allTopics("bootstrap", "events", ...args);

const EVENT_PREFIX = "testpilot::";

const observers = {};

export async function startupEvents() {
  log("startupEvents");
  addObserver(observeIdleDaily, "idle-daily", false);
}

export async function shutdownEvents() {
  log("shutdownEvents");
  removeObserver(observeIdleDaily, "idle-daily");
}

function observeIdleDaily() {
  PubSub.publishSync(eventsTopics("idle-daily"));
}

function EventObserver(topic) {
  this.topic = topic;
}

Object.assign(EventObserver.prototype, {
  register: function register() {
    addObserver(this, `${EVENT_PREFIX}${this.topic}`, false);
  },
  unregister: function unregister() {
    removeObserver(this, `${EVENT_PREFIX}${this.topic}`);
  },
  observe: function observe(subject, topic, payload) {
    // bits stolen from sdk/system/events
    if (
      subject &&
      typeof subject === "object" &&
      "wrappedJSObject" in subject &&
      "observersModuleSubjectWrapper" in subject.wrappedJSObject
    ) {
      subject = subject.wrappedJSObject.object;
    }
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      /* no-op */
    }
    PubSub.publishSync(eventsTopics(this.topic), {
      topic: this.topic,
      subject,
      payload
    });
  }
});
