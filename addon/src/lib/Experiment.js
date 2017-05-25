/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable */

// @flow

function toAbsoluteUrl(baseUrl, path) {
  if (!path) {
    return '';
  }
  return path[0] === '/' ? baseUrl + path : path;
}

function parseOptions(input: ?Object): TestPilotOptions {
  input = input || {};
  const options = {};
  // ratings defaults to enabled
  options.ratings = input.ratings === 'disabled' ? 'disabled' : 'enabled';
  return options;
}

export type FeatureFlag = 'enabled' | 'disabled';

export type TestPilotOptions = {
  ratings: FeatureFlag
};

export class Experiment {
  baseUrl: string;
  id: string;
  addon_id: string;
  title: string;
  thumbnail: string;
  version: string;
  xpi_url: string;
  html_url: string;
  survey_url: string;
  created: string;
  modified: string;
  completed: string;
  uninstalled: string;
  active: boolean;
  manuallyDisabled: boolean;
  installDate: ?Date;
  launchDate: Date;
  localeGrantlist: Array<string>;
  localeBlocklist: Array<string>;
  testpilotOptions: TestPilotOptions;
  constructor(object: Object, baseUrl?: string) {
    this.baseUrl = object.baseUrl || baseUrl || '';
    this.id = object.addon_id;
    this.addon_id = object.addon_id;
    this.title = object.title;
    this.thumbnail = toAbsoluteUrl(this.baseUrl, object.thumbnail);
    this.version = object.version;
    this.xpi_url = toAbsoluteUrl(this.baseUrl, object.xpi_url);
    this.html_url = toAbsoluteUrl(this.baseUrl, object.html_url);
    this.survey_url = toAbsoluteUrl(this.baseUrl, object.survey_url);
    this.created = object.created;
    this.modified = object.modified;
    this.completed = object.completed;
    this.uninstalled = object.uninstalled;

    this.active = object.active || false;
    this.manuallyDisabled = object.manuallyDisabled || false;
    this.installDate = object.installDate;
    this.launchDate = object.launch_date
      ? new Date(object.launch_date)
      : new Date(object.created);

    this.localeGrantlist = object.locale_grantlist || [];
    this.localeBlocklist = object.locale_blocklist || [];
    this.testpilotOptions = parseOptions(object.testpilot_options);
  }

  toJSON() {
    return {
      addon_id: this.addon_id,
      title: this.title,
      thumbnail: this.thumbnail,
      html_url: this.html_url,
      created: this.created,
      modified: this.modified,
      completed: this.completed,
      active: this.active,
      manuallyDisabled: this.manuallyDisabled,
      installDate: this.installDate
    };
  }
}

export type Experiments = { [id: string]: Experiment };
